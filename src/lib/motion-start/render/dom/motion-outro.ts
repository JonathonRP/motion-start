import type { TransitionConfig } from 'svelte/transition';
import { applyPopLayout, removePopLayout } from '../../components/AnimatePresence/PopChild/pop-layout';
import type { MotionOutroContext } from '../../context/OutroContext.svelte';
import type { PresenceContext } from '../../context/PresenceContext.svelte';
import type { MotionProps } from '../../motion/types';
import type { Box } from '../../projection/geometry/types';
import type { IProjectionNode, Measurements } from '../../projection/node/types';
import type { VisualElement } from '../VisualElement.svelte';

interface MotionOutroParams {
	context: MotionOutroContext | null;
	visualElement?: VisualElement<HTMLElement | SVGElement | unknown>;
}

const defaultExitDuration = 500;
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

function secondsToMilliseconds(value: unknown) {
	return typeof value === 'number' && Number.isFinite(value) ? value * 1000 : undefined;
}

function getTransitionDuration(transition: unknown) {
	if (!transition || typeof transition !== 'object') return undefined;

	const { duration, delay } = transition as {
		duration?: unknown;
		delay?: unknown;
	};
	const resolvedDuration = secondsToMilliseconds(duration);
	const resolvedDelay = secondsToMilliseconds(delay) ?? 0;

	return resolvedDuration === undefined ? undefined : resolvedDelay + resolvedDuration;
}

function getExitDuration(props: MotionProps) {
	const exit = props.exit;
	const exitTransition =
		exit && typeof exit === 'object' && !Array.isArray(exit) ? getTransitionDuration(exit.transition) : undefined;

	const transitionDuration = getTransitionDuration(props.transition);
	const duration = exitTransition ?? transitionDuration ?? (exit ? defaultExitDuration : 0);

	return Math.max(0, Math.min(duration, 5000));
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

export function motionEnterIntro(node: Element, { context, visualElement }: MotionOutroParams): TransitionConfig {
	pendingLayoutUpdates.delete(node);
	removePopLayout(node);
	if (node instanceof HTMLElement && node.dataset.motionPrevPointerEvents !== undefined) {
		node.style.pointerEvents = node.dataset.motionPrevPointerEvents;
		delete node.dataset.motionPrevPointerEvents;
	}
	visualElement?.animationState?.setActive('exit', false);

	return {
		delay: context?.mode === 'wait' ? context.remaining() : 0,
		duration: 0,
	};
}

export function motionExitOutro(node: Element, { context, visualElement }: MotionOutroParams): TransitionConfig {
	if (!context || !visualElement) return { duration: 0 };

	const element = visualElement;
	const duration = getExitDuration(element.props);
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
	if (node instanceof HTMLElement) {
		previousPointerEvents = node.style.pointerEvents;
		node.dataset.motionPrevPointerEvents = previousPointerEvents;
		node.style.pointerEvents = 'none';
	}

	const previousLayoutBox: Box | undefined = element.projection?.layout?.layoutBox;
	const projectionRoot = markProjectionWillUpdate(element);
	if (context.mode === 'popLayout') {
		removePopLayout = applyPopLayout(node as HTMLElement | SVGElement, context.nonce, previousLayoutBox);
		flushPopLayout(node);
		(projectionRoot as { update?: VoidFunction } | undefined)?.update?.();
	}

	const exitAnimation = element.animationState?.setActive('exit', true) ?? Promise.resolve();
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
				if (node instanceof HTMLElement) {
					node.style.pointerEvents = previousPointerEvents;
					delete node.dataset.motionPrevPointerEvents;
				}
				if (context.mode !== 'popLayout') {
					const finalProjectionRoot = markProjectionWillUpdate(element) ?? projectionRoot;
					if (finalProjectionRoot) {
						pendingLayoutUpdates.set(node, finalProjectionRoot);
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
