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

function getConfiguredExitDuration(visualElement: VisualElement<HTMLElement | SVGElement | unknown>) {
	const exit = visualElement.getProps().exit;
	if (!exit || Array.isArray(exit)) return { duration: 0, afterChildren: false };

	const resolved = resolveVariant(visualElement, exit, visualElement.presenceContext?.custom);
	const transition = resolved?.transition ?? visualElement.getDefaultTransition();
	if (!transition) return { duration: 0, afterChildren: false };

	return {
		duration: getTransitionDuration(transition as Record<string, unknown>),
		afterChildren: transition.when === 'afterChildren',
	};
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
	const configured = getConfiguredExitDuration(visualElement);
	const layoutDuration = getConfiguredLayoutDuration(visualElement);

	return configured.afterChildren
		? Math.max(layoutDuration, runningDuration + configured.duration)
		: Math.max(layoutDuration, runningDuration, configured.duration);
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
	if (visualElement?.presenceContext?.isPresent === false) {
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
	const layoutDuration = getConfiguredLayoutDuration(element);
	const duration = retainThroughCompletion(getExitDuration(element));
	let completedExit = true;
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
