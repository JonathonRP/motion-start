/**
 * Server-side generation of the opt-in pre-hydration `appear` animation.
 *
 * Everything here runs during SSR (and once more during hydration, so the
 * emitted markup matches). It resolves a motion element's `initial` -> `animate`
 * transition into plain WAAPI keyframes, and refuses to emit anything it cannot
 * reproduce exactly: an element that opts out simply animates on hydration.
 */

import { mapEasingToNativeEasing, supportedWaapiEasing } from '../../animation/animators/waapi/easing.js';
import type { ReducedMotionConfig } from '../../context/MotionConfigContext.svelte.js';
import type { MotionProps } from '../../motion/types.js';
import { buildHTMLStyles } from '../html/utils/build-styles.js';
import { createHtmlRenderState } from '../html/utils/create-render-state.js';
import { transformAliases, transformPropOrder, transformProps } from '../html/utils/transform.js';
import type { ResolvedValues } from '../types.js';
import { type AppearAnimationPayload, appearBootstrapSource } from './appear-bootstrap.js';
import { isCSSVariableName } from './utils/is-css-variable.js';
import { getValueAsType } from './value-types/get-as-type.js';
import { numberValueTypes } from './value-types/number.js';

type SerializableValue = string | number;

type StaticTarget = Record<string, unknown> & {
	transition?: Record<string, unknown>;
};

type ResolvedOptions = {
	keyframeOptions: { offset?: number[]; easing?: string[] };
	options: KeyframeAnimationOptions;
};

/**
 * Transition options we can reproduce with a single WAAPI animation. Anything
 * else (springs, repeats, per-value transitions, `when`/stagger orchestration)
 * makes the element fall back to animating on hydration.
 */
const supportedTransitionKeys = new Set(['type', 'duration', 'delay', 'ease', 'times', 'values']);
const reservedKeyframeProperties = new Set(['composite', 'easing', 'offset']);

/** Mirrors the animator defaults in `AcceleratedAnimation`/`keyframes`. */
const defaultDurationSeconds = 0.3;

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

function isSafeValue(value: unknown): value is SerializableValue {
	return typeof value === 'string' || isFiniteNumber(value);
}

function isSafeTargetValue(value: unknown): value is SerializableValue | SerializableValue[] {
	return isSafeValue(value) || (Array.isArray(value) && value.length >= 2 && value.every(isSafeValue));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}

function escapeAttribute(value: string) {
	return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/**
 * Values reaching the inline script have to survive `JSON.stringify` unchanged,
 * so reject anything exotic (functions, MotionValues, class instances, cycles).
 */
function isSerializable(value: unknown, seen = new Set<object>()): boolean {
	if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
	if (isFiniteNumber(value)) return true;
	if (typeof value !== 'object') return false;
	if (seen.has(value)) return false;
	seen.add(value);
	const safe = Array.isArray(value)
		? value.every((item) => isSerializable(item, seen))
		: isPlainObject(value) &&
			Object.entries(value).every(([key, item]) => key !== '__proto__' && isSerializable(item, seen));
	seen.delete(value);
	return safe;
}

/**
 * `appear` accepts `true` or an options object. Unknown keys are treated as a
 * typo rather than silently ignored.
 */
function resolveAppearOptions(appear: MotionProps['appear']): { nonce?: string } | undefined {
	const options = appear === true ? {} : appear;
	if (!isPlainObject(options)) return;
	if (Object.keys(options).some((key) => key !== 'nonce')) return;
	if (options.nonce !== undefined && typeof options.nonce !== 'string') return;
	return options as { nonce?: string };
}

/**
 * Flatten `animate` into a single static target. Multiple definitions are only
 * safe to merge while at most one of them carries its own transition, otherwise
 * Motion would run them with different timings than the merged animation.
 */
function resolveStaticTarget(props: MotionProps): StaticTarget | undefined {
	// Variant arrays can carry independent transitions that cannot be represented
	// by a single parser-time WAAPI animation without changing Motion semantics.
	if (Array.isArray(props.animate)) return;
	const definitions: unknown[] = [props.animate];
	const target: StaticTarget = {};
	let transitionCount = 0;

	for (let definition of definitions) {
		if (typeof definition === 'string') {
			definition = props.variants?.[definition];
		}
		if (!isPlainObject(definition) || !isSerializable(definition)) return;
		if (definition.transition !== undefined && ++transitionCount > 1) return;
		Object.assign(target, definition);
	}

	return Object.keys(target).length ? target : undefined;
}

function hasFunctionDefinition(definition: unknown, props: MotionProps): boolean {
	const definitions = Array.isArray(definition) ? definition : [definition];
	return definitions.some((item) => {
		if (typeof item === 'function') return true;
		return typeof item === 'string' && typeof props.variants?.[item] === 'function';
	});
}

function mapEase(ease: unknown): string | string[] | undefined {
	if (typeof ease === 'string') {
		return ease in supportedWaapiEasing ? supportedWaapiEasing[ease as keyof typeof supportedWaapiEasing] : undefined;
	}
	if (
		Array.isArray(ease) &&
		ease.length === 4 &&
		ease.every(isFiniteNumber) &&
		ease[0] >= 0 &&
		ease[0] <= 1 &&
		ease[2] >= 0 &&
		ease[2] <= 1
	) {
		return mapEasingToNativeEasing(ease as [number, number, number, number], 0) as string;
	}
	if (Array.isArray(ease)) {
		const mapped = ease.map(mapEase);
		return mapped.every((value): value is string => typeof value === 'string') ? mapped : undefined;
	}
	return;
}

function buildTransform(values: ResolvedValues, keys: string[]) {
	return keys
		.filter((key) => values[key] !== undefined)
		.map((key) => `${transformAliases[key] ?? key}(${getValueAsType(values[key], numberValueTypes[key])})`)
		.join(' ');
}

/**
 * Resolve a full set of values to the CSS declarations Motion's renderer would
 * write. Unlike the renderer, every transform in `transformKeys` is always
 * emitted so consecutive keyframes share a transform function list and
 * interpolate smoothly instead of falling back to a discrete animation.
 */
function buildCssValues(values: ResolvedValues, transformKeys: string[]) {
	const state = createHtmlRenderState();
	buildHTMLStyles(state, values);
	if (transformKeys.length) state.style.transform = buildTransform(values, transformKeys);
	return { ...state.vars, ...state.style };
}

function getTransformFrames(
	target: StaticTarget,
	initial: ResolvedValues,
	transformKeys: string[]
): string[] | undefined {
	const targetValues = transformKeys.map((key) => target[key]).filter((value) => value !== undefined);
	const arrayLengths = targetValues.filter(Array.isArray).map((value) => value.length);
	// Every keyframe array has to agree on a frame count, and mixing arrays with
	// single values would silently drop the intermediate frames.
	if (arrayLengths.length && (arrayLengths.length !== targetValues.length || new Set(arrayLengths).size !== 1)) return;
	const frameCount = arrayLengths[0] ?? 2;
	const frames: string[] = [];

	for (let index = 0; index < frameCount; index++) {
		const values = { ...initial };
		for (const key of transformKeys) {
			const targetValue = target[key];
			if (targetValue === undefined) continue;
			values[key] = Array.isArray(targetValue) ? targetValue[index] : index === 0 ? initial[key] : targetValue;
			if (!isSafeValue(values[key])) return;
		}
		const transform = buildCssValues(values, transformKeys).transform;
		if (typeof transform !== 'string' || !transform) return;
		frames.push(transform);
	}

	return frames;
}

function createOptions(transition: Record<string, unknown>, frameCount: number): ResolvedOptions | undefined {
	if (Object.keys(transition).some((key) => !supportedTransitionKeys.has(key))) return;
	if (transition.type !== 'tween' && transition.type !== 'keyframes') return;
	if (transition.duration !== undefined && (!isFiniteNumber(transition.duration) || transition.duration < 0)) return;
	if (transition.delay !== undefined && (!isFiniteNumber(transition.delay) || transition.delay < 0)) return;

	const duration = (isFiniteNumber(transition.duration) ? transition.duration : defaultDurationSeconds) * 1000;
	const delay = isFiniteNumber(transition.delay) ? transition.delay * 1000 : 0;
	if (!Number.isFinite(duration) || !Number.isFinite(delay)) return;
	// `animateMotionValue` supplies easeOut before merging the value transition.
	// Handoff always resumes on the main thread, so matching that default avoids
	// a visible progress jump when Motion takes ownership of the animation.
	const easing = transition.ease === undefined ? supportedWaapiEasing.easeOut : mapEase(transition.ease);
	if (!easing) return;
	const keyframeOptions: ResolvedOptions['keyframeOptions'] = {};

	if (transition.times !== undefined) {
		const times = transition.times;
		if (
			!Array.isArray(times) ||
			times.length !== frameCount ||
			!times.every(
				(time, index) => isFiniteNumber(time) && time >= 0 && time <= 1 && (index === 0 || time >= times[index - 1])
			)
		)
			return;
		keyframeOptions.offset = times;
	}
	if (Array.isArray(easing)) {
		if (easing.length !== frameCount - 1) return;
		keyframeOptions.easing = easing;
	}

	return {
		keyframeOptions,
		options: {
			delay,
			duration,
			easing: Array.isArray(easing) ? 'linear' : easing,
			fill: 'both',
		},
	};
}

function buildAnimations(
	initial: ResolvedValues,
	values: StaticTarget,
	transition: Record<string, unknown>,
	reducedMotion: ReducedMotionConfig | undefined
): AppearAnimationPayload[] | undefined {
	const targetTransformKeys = Object.keys(values).filter((key) => transformProps.has(key));
	const transformKeys = transformPropOrder.filter(
		(key) => targetTransformKeys.includes(key) || initial[key] !== undefined
	);
	// A literal `transform` cannot be combined with individual transform values:
	// `buildCssValues` rebuilds the property from those values and would drop it.
	if (transformKeys.length && values.transform !== undefined) return;

	const animations: AppearAnimationPayload[] = [];

	if (targetTransformKeys.length && reducedMotion !== 'always') {
		const frames = getTransformFrames(values, initial, transformKeys);
		if (!frames) return;
		const resolved = createOptions(transition, frames.length);
		if (!resolved) return;
		animations.push({
			name: 'transform',
			keyframes: { transform: frames, ...resolved.keyframeOptions },
			options: resolved.options,
			skipOnReducedMotion: reducedMotion === 'user',
		});
	}

	const initialCss = buildCssValues(initial, transformKeys);
	for (const [name, value] of Object.entries(values)) {
		if (transformProps.has(name)) continue;
		// PropertyIndexedKeyframes reserves these names for timing metadata, and
		// unregistered CSS variables animate discretely rather than like Motion.
		if (reservedKeyframeProperties.has(name) || isCSSVariableName(name)) return;
		if (!isSafeTargetValue(value)) return;
		const frames = Array.isArray(value)
			? value.map((frameValue) => buildCssValues({ ...initial, [name]: frameValue }, transformKeys)[name])
			: [initialCss[name], buildCssValues({ ...initial, [name]: value }, transformKeys)[name]];
		// A value missing from `initial` has no server-resolvable first frame.
		if (!frames.every(isSafeValue)) return;
		const resolved = createOptions(transition, frames.length);
		if (!resolved) return;
		animations.push({
			name,
			keyframes: { [name]: frames as SerializableValue[], ...resolved.keyframeOptions },
			options: resolved.options,
		});
	}

	return animations.length ? animations : undefined;
}

/**
 * Build the `<script>` that starts this element's entrance animation while the
 * document is still parsing, or `undefined` when the element should fall back to
 * animating on hydration.
 */
export function createAppearBootstrap(
	props: MotionProps,
	initial: ResolvedValues,
	reducedMotion?: ReducedMotionConfig,
	blockInitialAnimation = false
): string | undefined {
	const appearOptions = resolveAppearOptions(props.appear);
	if (
		!appearOptions ||
		blockInitialAnimation ||
		props.initial === false ||
		props.transformTemplate ||
		hasFunctionDefinition(props.initial, props) ||
		!isSerializable(initial)
	)
		return;

	// Generated by `createRendererMotionComponent` and rendered onto the element,
	// so the script can find itself and Motion can find the animation.
	const elementId = props['data-framer-appear-id'];
	if (typeof elementId !== 'string' || !elementId) return;

	const target = resolveStaticTarget(props);
	if (!target) return;

	const values = { ...target };
	const targetTransition = values.transition;
	delete values.transition;
	delete values.transitionEnd;
	const transition: unknown = targetTransition ?? props.transition;
	if (!isPlainObject(transition) || !isSerializable(transition)) return;
	if (Object.keys(values).length === 0 || !Object.values(values).every(isSafeTargetValue)) return;

	const animations = buildAnimations(initial, values, transition, reducedMotion);
	if (!animations) return;

	// Percent-encoded so user data can never be parsed as JavaScript.
	const data = encodeURIComponent(JSON.stringify(animations));
	const nonce = appearOptions.nonce ? ` nonce="${escapeAttribute(appearOptions.nonce)}"` : '';
	return `<script${nonce} data-motion-appear="${data}">${appearBootstrapSource}</script>`;
}
