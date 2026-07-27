import { tick } from 'svelte';
import type { TransitionConfig } from 'svelte/transition';
import { getValueTransition } from '../../animation/utils/get-value-transition.js';
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
// Retained layout outros rely on tick(0), which Svelte skips when it aborts
// an outro by re-adding the same keyed node.
const pendingExitFinish = new WeakMap<Element, VoidFunction>();

type LayoutBox = Measurements['layoutBox'];

function cloneBox(box: LayoutBox): LayoutBox {
	return {
		x: { ...box.x },
		y: { ...box.y },
	};
}

function cloneMeasurements(measurements: Measurements, layoutBox = measurements.layoutBox): Measurements {
	return {
		...measurements,
		measuredBox: cloneBox(layoutBox),
		layoutBox: cloneBox(layoutBox),
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

	// An interrupted shared-layout animation is visually at `target`, not at
	// the static DOM layout. React captures this through its pre-commit
	// lifecycle; the Svelte outro starts before keyed teardown, so preserve the
	// same visual origin explicitly.
	if (node.currentAnimation && node.target) {
		node.snapshot = cloneMeasurements(node.layout, node.target);
		return;
	}

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

const defaultLayoutTransition = {
	duration: 0.45,
	ease: [0.4, 0, 0.1, 1],
};
// Matches the frame-delta cap used by Framer Motion's render batcher.
const maxFrameElapsed = 40;

function getTransitionDuration(transition: Record<string, unknown> | undefined) {
	if (!transition) return 0;

	const duration = typeof transition.duration === 'number' ? transition.duration : 0;
	const delay = typeof transition.delay === 'number' ? transition.delay : 0;
	const repeat = typeof transition.repeat === 'number' ? transition.repeat : 0;
	const repeatDelay = typeof transition.repeatDelay === 'number' ? transition.repeatDelay : 0;

	return Math.max(0, delay + duration * (repeat + 1) + repeatDelay * repeat) * 1000;
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

function getConfiguredExitTiming(visualElement: VisualElement<HTMLElement | SVGElement | unknown>) {
	const exit = visualElement.getProps().exit ?? visualElement.getVariant?.('exit');
	if (!exit || Array.isArray(exit)) {
		return {
			duration: 0,
			delayChildren: 0,
			staggerChildren: 0,
			staggerDirection: 1,
			when: undefined,
		};
	}

	const resolved = resolveVariant(visualElement, exit, visualElement.presenceContext?.custom);
	const transition = resolved?.transition ?? visualElement.getDefaultTransition();
	if (!transition) {
		return {
			duration: 0,
			delayChildren: 0,
			staggerChildren: 0,
			staggerDirection: 1,
			when: undefined,
		};
	}

	return {
		duration: getTransitionDuration(transition as Record<string, unknown>),
		delayChildren: transition.delayChildren ?? 0,
		staggerChildren: transition.staggerChildren ?? 0,
		staggerDirection: transition.staggerDirection ?? 1,
		when: transition.when,
	};
}

/**
 * Upstream sequences named variants through `variantChildren`. React keeps
 * the subtree mounted until those animation promises settle, whereas Svelte
 * needs a transition duration up front to retain an outro block. Mirror the
 * same before/after/concurrent timing solely for that retention window.
 */
function getConfiguredExitTreeDuration(visualElement: VisualElement<HTMLElement | SVGElement | unknown>): number {
	const timing = getConfiguredExitTiming(visualElement);
	const children = Array.from(visualElement.variantChildren ?? []).sort((a, b) => a.sortNodePosition(b));
	const maxStaggerDuration = Math.max(0, children.length - 1) * timing.staggerChildren;
	let childrenDuration = 0;

	children.forEach((child, index) => {
		const staggerDuration =
			timing.staggerDirection === 1
				? index * timing.staggerChildren
				: maxStaggerDuration - index * timing.staggerChildren;
		const delay = timing.delayChildren + staggerDuration;
		childrenDuration = Math.max(
			childrenDuration,
			delay * 1000 + getConfiguredExitTreeDuration(child as VisualElement<HTMLElement | SVGElement | unknown>)
		);
	});

	return (timing.when === 'beforeChildren' || timing.when === 'afterChildren') && childrenDuration
		? timing.duration + childrenDuration + maxFrameElapsed
		: Math.max(timing.duration, childrenDuration);
}

function getConfiguredLayoutDuration(visualElement: VisualElement<HTMLElement | SVGElement | unknown>) {
	const projection = visualElement.projection;
	if (!projection || (!projection.options.layout && !projection.options.layoutId)) return 0;

	const transition = projection.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
	const layoutTransition = transition ? getValueTransition(transition, 'layout') : undefined;
	return getTransitionDuration(layoutTransition as Record<string, unknown> | undefined);
}

function getExitDuration(visualElement: VisualElement<HTMLElement | SVGElement | unknown>) {
	const runningDuration = getRunningTreeDuration(visualElement);
	const timing = getConfiguredExitTiming(visualElement);
	const configuredDuration = getConfiguredExitTreeDuration(visualElement);
	const layoutDuration = getConfiguredLayoutDuration(visualElement);
	const runningSequenceDuration =
		timing.when === 'afterChildren' && runningDuration
			? runningDuration + timing.duration + maxFrameElapsed
			: runningDuration;

	return Math.max(layoutDuration, runningSequenceDuration, configuredDuration);
}

/**
 * Motion and Svelte both finish animations from a requestAnimationFrame. A
 * one-millisecond duration margin guarantees Svelte removes the retained block
 * on the frame after Motion has committed its final value and completion
 * callbacks, rather than racing them on the same frame.
 */
function retainThroughCompletion(duration: number) {
	return duration > 0 ? duration + 1 : 0;
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

function markProjectionWillUpdate(
	visualElement: VisualElement<HTMLElement | SVGElement | unknown>,
	presenceAffectsLayout = true
) {
	const projection = visualElement.projection;
	if (!projection) return undefined;

	const root = projection.root;
	const presenceId = visualElement.presenceContext?.id;

	if (!root?.isUpdating) {
		root?.startUpdate();
	}

	if (!presenceAffectsLayout) {
		seedLateSnapshot(projection);
		projection.willUpdate();
		return root;
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

function hideFromLayout(motionNode: Element) {
	if (!(motionNode instanceof HTMLElement) || motionNode.dataset.motionWaitDisplay !== undefined) return;
	motionNode.dataset.motionWaitDisplay = motionNode.style.display;
	motionNode.style.display = 'none';
}

function restoreWaitDisplay(motionNode: Element) {
	if (!(motionNode instanceof HTMLElement)) return;
	const previous = motionNode.dataset.motionWaitDisplay;
	if (previous === undefined) return;
	delete motionNode.dataset.motionWaitDisplay;
	motionNode.style.display = previous;
}

/**
 * `mode="wait"` must not lay the incoming child out until the outgoing one has
 * finished exiting.
 *
 * This used to be attempted by delaying a `display: none` CSS transition by
 * `context.remaining()`. That reads a duration the *outro* publishes through
 * `reserve()`, but Svelte builds the incoming keyed block before tearing the
 * outgoing one down, so the intro almost always read `0`, emitted no CSS at all,
 * and both children were laid out at once.
 *
 * Hiding the node imperatively removes the ordering dependency: hide first, ask
 * afterwards. `waitForExit()` resolves immediately when nothing is exiting, so a
 * plain enter is restored in the same tick, before paint.
 */
function deferLayoutUntilExitsComplete(motionNode: Element, context: MotionOutroContext) {
	if (!(motionNode instanceof HTMLElement) || motionNode.dataset.motionWaitDisplay !== undefined) return;

	hideFromLayout(motionNode);

	const reveal = () => restoreWaitDisplay(motionNode);

	tick()
		.then(() => context.waitForExit())
		.then(reveal, reveal);
}

export function motionEnterIntro(
	node: Element,
	{ context, visualElement }: MotionOutroParams
): TransitionConfig | (() => TransitionConfig) {
	const motionNode = getMotionNode(node, visualElement);
	pendingLayoutUpdates.delete(motionNode);
	removePopLayout(motionNode);
	if (visualElement?.presenceContext?.isPresent === false) {
		const releaseExitFinish = pendingExitFinish.get(motionNode);
		pendingExitFinish.delete(motionNode);
		releaseExitFinish?.();
		visualElement.presenceContext = visualElement.prevPresenceContext ?? null;
		visualElement.prevPresenceContext = undefined;
		if (visualElement.projection) {
			const projection = visualElement.projection;
			projection.isPresent = true;
			projection.willUpdate();
			projection.promote();
			queueMicrotask(() => {
				if (visualElement.projection === projection && motionNode.isConnected) {
					projection.root?.didUpdate();
				}
			});
		}
	}
	if (motionNode instanceof HTMLElement && motionNode.dataset.motionPrevPointerEvents !== undefined) {
		motionNode.style.pointerEvents = motionNode.dataset.motionPrevPointerEvents;
		delete motionNode.dataset.motionPrevPointerEvents;
	}
	// A reversed exit re-enters the same node, which `finish` may already have
	// pulled out of flow.
	restoreWaitDisplay(motionNode);
	visualElement?.animationState?.setActive('exit', false);

	if (context?.mode === 'wait') {
		deferLayoutUntilExitsComplete(motionNode, context);
	}

	return () => ({ duration: 0 });
}

export function motionExitOutro(node: Element, { context, visualElement }: MotionOutroParams): TransitionConfig {
	if (!context || !visualElement) return { duration: 0 };

	const element = visualElement;
	const outroContext = context;
	const motionNode = getMotionNode(node, element);
	const complete = context.begin();
	let releasePopLayout: VoidFunction | undefined;
	let previousPointerEvents = '';
	let completed = false;

	function finish(completedExit = true) {
		if (completed) return;
		completed = true;
		pendingExitFinish.delete(motionNode);
		// The exit animation is done, but Svelte keeps the node mounted until its
		// own outro timer elapses. In `wait` mode that trailing window would let
		// the outgoing and incoming children share the layout, so drop the
		// finished node out of flow immediately. `motionEnterIntro` restores it
		// if the exit is reversed before removal.
		if (outroContext.mode === 'wait') {
			restoreWaitDisplay(motionNode);
			hideFromLayout(motionNode);
		}
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
	// Upstream avoids refreshing sibling presence context when this flag is
	// false while the exiting child's own presence still changes.
	const projectionRoot = markProjectionWillUpdate(element, context.presenceAffectsLayout);
	if (context.mode === 'popLayout') {
		releasePopLayout = applyPopLayout(motionNode as HTMLElement | SVGElement, context.nonce, previousLayoutBox);
		flushPopLayout(motionNode);
		(projectionRoot as { update?: VoidFunction } | undefined)?.update?.();
	}

	const exitAnimation = element.animationState?.setActive('exit', true) ?? Promise.resolve();
	const layoutDuration = getConfiguredLayoutDuration(element);
	const duration = retainThroughCompletion(getExitDuration(element));
	let completedExit = true;
	pendingExitFinish.set(motionNode, () => finish(false));
	exitAnimation.then(
		() => {
			if (layoutDuration === 0) finish();
		},
		() => {
			completedExit = false;
			if (layoutDuration === 0) finish(false);
		}
	);

	if (duration > 0) {
		context.reserve(duration);
	}

	return {
		duration,
		tick(t) {
			if (t === 0) {
				releasePopLayout?.();
				if (motionNode instanceof HTMLElement) {
					motionNode.style.pointerEvents = previousPointerEvents;
					delete motionNode.dataset.motionPrevPointerEvents;
				}
				if (context.mode !== 'popLayout') {
					const finalProjectionRoot =
						markProjectionWillUpdate(element, context.presenceAffectsLayout) ?? projectionRoot;
					if (finalProjectionRoot) {
						pendingLayoutUpdates.set(motionNode, finalProjectionRoot);
					}
				}
				finish(completedExit);
			}
		},
	};
}

export function flushPendingMotionExitLayout(node: Element) {
	const projectionRoot = pendingLayoutUpdates.get(node);
	if (!projectionRoot) return;

	pendingLayoutUpdates.delete(node);
	// Svelte runs attachment teardown before detaching the DOM node. Defer the
	// final projection read until teardown has completed so the outgoing node
	// can't receive a reset render and siblings are measured without it. This
	// mirrors Framer Motion's scheduleCheckAfterUnmount post-render phase.
	queueMicrotask(() => {
		(projectionRoot as { update?: VoidFunction }).update?.();
	});
}
