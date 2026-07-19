import type { TransitionConfig } from 'svelte/transition';
import { applyPopLayout, removePopLayout } from '../../components/AnimatePresence/PopChild/pop-layout.js';
import type { MotionOutroContext } from '../../context/OutroContext.svelte.js';
import type { PresenceContext } from '../../context/PresenceContext.svelte.js';
import type { Box } from '../../projection/geometry/types.js';
import type { IProjectionNode, Measurements } from '../../projection/node/types.js';
import { resolveVariant } from '../utils/resolve-dynamic-variants.js';
import type { VisualElement } from '../VisualElement.svelte.js';

interface MotionOutroParams {
	context: MotionOutroContext | null;
	visualElement?: VisualElement<HTMLElement | SVGElement | unknown>;
}

let presenceChildId = 0;
const pendingLayoutUpdates = new WeakMap<Element, IProjectionNode<unknown>>();

type LayoutBox = Measurements['layoutBox'];

function cloneBox(box: LayoutBox): LayoutBox {
	return {
		x: { ...box.x },
		y: { ...box.y },
	};
}

function cloneMeasurements(measurements: Measurements): Measurements {
	return {
		...measurements,
		measuredBox: cloneBox(measurements.measuredBox),
		layoutBox: cloneBox(measurements.layoutBox),
		latestValues: { ...measurements.latestValues },
	};
}

function boxesDiffer(a: LayoutBox, b: LayoutBox) {
	return (
		Math.abs(a.x.min - b.x.min) > 0.5 ||
		Math.abs(a.x.max - b.x.max) > 0.5 ||
		Math.abs(a.y.min - b.y.min) > 0.5 ||
		Math.abs(a.y.max - b.y.max) > 0.5
	);
}

function seedLateSnapshot(node: IProjectionNode<unknown>) {
	if (node.snapshot || !node.layout || !node.instance || node.root?.isUpdateBlocked()) return;

	const instance = node.instance as Element | undefined;
	if (instance && !instance.isConnected) return;

	const measured = node.measure(false);
	if (boxesDiffer(measured.layoutBox, node.layout.layoutBox)) {
		node.snapshot = cloneMeasurements(node.layout);
	}
}

function flushPopLayout(node: Element) {
	node.parentElement?.getBoundingClientRect();
}

interface AnimationWithOptions {
	duration: number;
	options?: {
		delay?: number;
		repeat?: number;
		repeatDelay?: number;
	};
}

function getRunningAnimationDuration(visualElement: VisualElement<HTMLElement | SVGElement | unknown>) {
	let longest = 0;

	for (const value of visualElement.values.values()) {
		const animation = value.animation as AnimationWithOptions | undefined;
		if (!animation) continue;

		// Reading duration synchronously flushes Motion's keyframe resolver, so
		// Svelte retains the block for the resolved tween/spring rather than a
		// timeout guessed from the public props.
		const { delay = 0, repeat = 0, repeatDelay = 0 } = animation.options ?? {};
		const total = Math.max(0, delay) / 1000 + animation.duration * (repeat + 1) + (repeatDelay / 1000) * repeat;
		longest = Math.max(longest, total * 1000);
	}

	return longest;
}

function getRunningTreeDuration(visualElement: VisualElement<HTMLElement | SVGElement | unknown>) {
	let longest = getRunningAnimationDuration(visualElement);

	for (const child of visualElement.children) {
		longest = Math.max(longest, getRunningTreeDuration(child as VisualElement<HTMLElement | SVGElement | unknown>));
	}

	return longest;
}

function getConfiguredExitDuration(visualElement: VisualElement<HTMLElement | SVGElement | unknown>) {
	const exit = visualElement.getProps().exit;
	if (!exit || Array.isArray(exit)) return { duration: 0, afterChildren: false };

	const resolved = resolveVariant(visualElement, exit, visualElement.presenceContext?.custom);
	const transition = resolved?.transition ?? visualElement.getDefaultTransition();
	if (!transition) return { duration: 0, afterChildren: false };
	const duration = 'duration' in transition ? transition.duration : undefined;
	if (typeof duration !== 'number') return { duration: 0, afterChildren: false };

	const delay = typeof transition.delay === 'number' ? transition.delay : 0;
	const repeat = typeof transition.repeat === 'number' ? transition.repeat : 0;
	const repeatDelay = typeof transition.repeatDelay === 'number' ? transition.repeatDelay : 0;

	return {
		duration: Math.max(0, delay + duration * (repeat + 1) + repeatDelay * repeat) * 1000,
		afterChildren: transition.when === 'afterChildren',
	};
}

function getExitDuration(visualElement: VisualElement<HTMLElement | SVGElement | unknown>) {
	const runningDuration = getRunningTreeDuration(visualElement);
	const configured = getConfiguredExitDuration(visualElement);

	return configured.afterChildren
		? runningDuration + configured.duration
		: Math.max(runningDuration, configured.duration);
}

function getMotionNode(node: Element, visualElement: VisualElement<HTMLElement | SVGElement | unknown> | undefined) {
	return visualElement?.current instanceof Element ? visualElement.current : node;
}

function makePresenceContext(
	visualElement: VisualElement<HTMLElement | SVGElement | unknown>,
	context: MotionOutroContext,
	onExitComplete: PresenceContext['onExitComplete']
): PresenceContext {
	const previous = visualElement.presenceContext;

	return {
		// React AnimatePresence renders one PresenceChild per keyed child. Svelte
		// owns keyed {#each} lifetimes, so the outro bridge creates the equivalent
		// per-element presence child when a motion element starts exiting.
		id: `outro-${presenceChildId++}`,
		isPresent: false,
		register: () => () => undefined,
		onExitComplete,
		initial: previous?.initial,
		get custom() {
			return context.custom;
		},
		presenceLayoutVersion: previous?.presenceLayoutVersion,
	};
}

function markProjectionWillUpdate(visualElement: VisualElement<HTMLElement | SVGElement | unknown>) {
	const projection = visualElement.projection;
	if (!projection) return undefined;

	const root = projection.root;
	const presenceId = visualElement.presenceContext?.id;

	if (!root?.isUpdating) {
		root?.startUpdate();
	}

	if (!presenceId || !root?.nodes) {
		projection.willUpdate();
		return root;
	}

	root.nodes.forEach((node: IProjectionNode<unknown>) => {
		if (
			node.options.layout ||
			node.options.layoutId ||
			node.options.visualElement?.presenceContext?.id === presenceId
		) {
			seedLateSnapshot(node);
			node.willUpdate();
		}
	});

	return root;
}

export function motionEnterIntro(
	node: Element,
	{ context, visualElement }: MotionOutroParams
): TransitionConfig | (() => TransitionConfig) {
	const motionNode = getMotionNode(node, visualElement);
	pendingLayoutUpdates.delete(motionNode);
	removePopLayout(motionNode);
	if (motionNode instanceof HTMLElement && motionNode.dataset.motionPrevPointerEvents !== undefined) {
		motionNode.style.pointerEvents = motionNode.dataset.motionPrevPointerEvents;
		delete motionNode.dataset.motionPrevPointerEvents;
	}
	visualElement?.animationState?.setActive('exit', false);

	return () => {
		const delay = context?.mode === 'wait' ? context.remaining() : 0;
		return {
			delay,
			duration: 0,
			css: delay > 0 ? (t) => (t < 1 ? 'display: none' : '') : undefined,
		};
	};
}

export function motionExitOutro(node: Element, { context, visualElement }: MotionOutroParams): TransitionConfig {
	if (!context || !visualElement) return { duration: 0 };

	const element = visualElement;
	const motionNode = getMotionNode(node, element);
	const complete = context.begin();
	let removePopLayout: VoidFunction | undefined;
	let previousPointerEvents = '';
	let completed = false;

	function finish(completedExit = true) {
		if (completed) return;
		completed = true;
		complete(element.presenceContext?.id ?? 'outro', completedExit);
	}

	element.prevPresenceContext = element.presenceContext;
	element.presenceContext = makePresenceContext(element, context, () => finish());
	if (element.projection) {
		element.projection.isPresent = false;
	}
	if (motionNode instanceof HTMLElement) {
		previousPointerEvents = motionNode.style.pointerEvents;
		motionNode.dataset.motionPrevPointerEvents = previousPointerEvents;
		motionNode.style.pointerEvents = 'none';
	}

	const previousLayoutBox: Box | undefined = element.projection?.layout?.layoutBox;
	const projectionRoot = markProjectionWillUpdate(element);
	if (context.mode === 'popLayout') {
		removePopLayout = applyPopLayout(motionNode as HTMLElement | SVGElement, context.nonce, previousLayoutBox);
		flushPopLayout(motionNode);
		(projectionRoot as { update?: VoidFunction } | undefined)?.update?.();
	}

	const exitAnimation = element.animationState?.setActive('exit', true) ?? Promise.resolve();
	const duration = getExitDuration(element);
	exitAnimation.then(
		() => finish(),
		() => finish(false)
	);

	if (duration > 0) {
		context.reserve(duration);
	}

	return {
		duration,
		tick(t) {
			if (t === 0) {
				removePopLayout?.();
				if (motionNode instanceof HTMLElement) {
					motionNode.style.pointerEvents = previousPointerEvents;
					delete motionNode.dataset.motionPrevPointerEvents;
				}
				if (context.mode !== 'popLayout') {
					const finalProjectionRoot = markProjectionWillUpdate(element) ?? projectionRoot;
					if (finalProjectionRoot) {
						pendingLayoutUpdates.set(motionNode, finalProjectionRoot);
					}
				}
				finish();
			}
		},
	};
}

export function flushPendingMotionExitLayout(node: Element) {
	const projectionRoot = pendingLayoutUpdates.get(node);
	if (!projectionRoot) return;

	pendingLayoutUpdates.delete(node);
	(projectionRoot as { update?: VoidFunction }).update?.();
}
