/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { watch } from 'runed';
import { type Component, tick } from 'svelte';
import { optimizedAppearDataAttribute } from '../../animation/optimized-appear/data-id.js';
import { useLazyContext } from '../../context/LazyContext.js';
import { useMotionConfigContext } from '../../context/MotionConfigContext.svelte.js';
import { type MotionContext, useMotionContext } from '../../context/MotionContext/index.js';
import { useMotionOutroContext } from '../../context/OutroContext.svelte.js';
import { usePresenceContext } from '../../context/PresenceContext.svelte.js';
import { type InitialPromotionConfig, useSwitchLayoutGroupContext } from '../../context/SwitchLayoutGroupContext.js';
import { microtask } from '../../frameloop/microtask.js';
import type { IProjectionNode } from '../../projection/node/types.js';
import type { CreateVisualElement } from '../../render/types.js';
import type { VisualElement } from '../../render/VisualElement.svelte.js';
import { isRefObject } from '../../utils/is-ref-object.js';
import type { MotionProps } from '../types.js';
import type { VisualState } from './use-visual-state.svelte.js';

export function useVisualElement<Instance, RenderState>(
	Component: string | Component<any>,
	visualState: () => VisualState<Instance, RenderState>,
	props: () => MotionProps,
	createVisualElement: CreateVisualElement<Instance> | undefined,
	ProjectionNodeConstructor: () => (new (...args: any[]) => IProjectionNode<unknown>) | undefined,
	parentContext: MotionContext = useMotionContext()
): () => VisualElement<Instance> | null {
	const parent = $derived(parentContext.visualElement);

	const presenceContext = usePresenceContext();
	const isPresent = $derived(presenceContext?.isPresent);
	const motionConfigContext = useMotionConfigContext();
	const motionOutroContext = useMotionOutroContext();
	const reducedMotionContext = $derived(motionConfigContext.reducedMotion);
	const initialLayoutGroupConfig = $derived(useSwitchLayoutGroupContext());

	let visualElement = $state<VisualElement<Instance> | null>(null);

	const lazyContext = useLazyContext();
	const getCreateVisualElement = () => createVisualElement || lazyContext.renderer;

	const getPresenceContextSnapshot = () => (presenceContext ? { ...presenceContext } : null);

	function createInitialVisualElement(renderer: CreateVisualElement<Instance> | undefined) {
		if (visualElement || !renderer) return;

		visualElement =
			renderer(Component, {
				visualState: visualState(),
				parent,
				props: props(),
				presenceContext: getPresenceContextSnapshot(),
				blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
				reducedMotionConfig: reducedMotionContext,
			}) ?? null;
	}

	createInitialVisualElement(getCreateVisualElement());

	$effect.pre(() => {
		createInitialVisualElement(getCreateVisualElement());
	});

	$effect.pre(() => {
		const ProjectionNode = ProjectionNodeConstructor();
		if (
			visualElement &&
			!visualElement.projection &&
			ProjectionNode &&
			(visualElement.type === 'html' || visualElement.type === 'svg')
		) {
			createProjectionNode(visualElement, props(), ProjectionNode, initialLayoutGroupConfig);
		}
	});

	let isMounted = $state(false);
	let commitVersion = $state(0);

	watch.pre(
		[() => props(), () => isPresent],
		() => {
			if (!visualElement || !isMounted) return;

			visualElement.update(props(), getPresenceContextSnapshot());

			commitVersion += 1;
		},
		{ lazy: true }
	);

	const optimisedAppearId = props()[optimizedAppearDataAttribute as keyof ReturnType<typeof props>];
	let wantsHandoff =
		Boolean(optimisedAppearId) &&
		typeof window !== 'undefined' &&
		!window.MotionHandoffIsComplete?.(optimisedAppearId) &&
		window.MotionHasOptimisedAnimation?.(optimisedAppearId);
	let hasStartedAnimation = false;

	async function animateChanges(element: VisualElement<Instance>, onStarted?: () => void) {
		if (!hasStartedAnimation && motionOutroContext?.mode === 'wait') {
			// Let Svelte initialise sibling outros before checking the shared
			// counter. A replacement's visual element can otherwise mount first.
			await tick();
			await motionOutroContext.waitForExit();
		}
		hasStartedAnimation = true;
		const animation = element.animationState?.animateChanges();
		onStarted?.();
		return animation;
	}

	watch.pre([() => visualElement, () => commitVersion], () => {
		const element = visualElement;
		if (!element) return;
		const shouldHandoff = wantsHandoff;

		isMounted = true;
		if (typeof window !== 'undefined') {
			window.MotionIsMounted = true;
		}

		tick().then(() => {
			element.updateFeatures();
			microtask.render(element.render);

			if (shouldHandoff && element.animationState) {
				animateChanges(element, () => {
					if (typeof window !== 'undefined') {
						window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
					}
				});
			}
		});
	});

	watch.pre([() => visualElement, () => commitVersion], () => {
		const element = visualElement;
		if (!element) return;
		const shouldHandoff = wantsHandoff;

		tick().then(() => {
			if (!shouldHandoff && element.animationState) {
				animateChanges(element);
			}
		});
		if (shouldHandoff) {
			wantsHandoff = false;
		}
	});

	return () => visualElement;
}

function createProjectionNode(
	visualElement: VisualElement<any>,
	props: MotionProps,
	ProjectionNodeConstructor: new (...args: any[]) => IProjectionNode<unknown>,
	initialPromotionConfig?: InitialPromotionConfig | null
) {
	const { layoutId, layout, drag, dragConstraints, layoutScroll, layoutRoot } = props;

	visualElement.projection = new ProjectionNodeConstructor(
		visualElement.latestValues,
		props['data-framer-portal-id'] ? undefined : getClosestProjectingNode(visualElement.parent, layoutId)
	) as IProjectionNode<unknown>;

	visualElement.projection.setOptions({
		layoutId,
		layout,
		alwaysMeasureLayout: Boolean(drag) || (dragConstraints && isRefObject(dragConstraints)),
		get visualElement() {
			return visualElement;
		},
		animationType: typeof layout === 'string' ? (layout as 'size' | 'position' | 'both' | 'preserve-aspect') : 'both',
		initialPromotionConfig: initialPromotionConfig ?? undefined,
		layoutScroll,
		layoutRoot,
	});
}

function getClosestProjectingNode(
	visualElement: VisualElement<unknown, unknown, { allowProjection?: boolean }> | null | undefined,
	layoutId?: string
): IProjectionNode<unknown> | undefined {
	if (!visualElement) return undefined;

	const projection = visualElement.options.allowProjection !== false ? visualElement.projection : undefined;
	return projection && (layoutId === undefined || projection.options.layoutId !== layoutId)
		? projection
		: getClosestProjectingNode(visualElement.parent, layoutId);
}
