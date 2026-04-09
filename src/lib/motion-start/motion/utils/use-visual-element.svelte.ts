/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { watch } from 'runed';
import { tick, type Component } from 'svelte';
import { optimizedAppearDataAttribute } from '../../animation/optimized-appear/data-id';
import { useLazyContext } from '../../context/LazyContext';
import { useMotionConfigContext } from '../../context/MotionConfigContext.svelte';
import { useMotionContext } from '../../context/MotionContext';
import { usePresenceContext } from '../../context/PresenceContext.svelte';
import { useSwitchLayoutGroupContext, type InitialPromotionConfig } from '../../context/SwitchLayoutGroupContext';
import { microtask } from '../../frameloop/microtask';
import type { IProjectionNode } from '../../projection/node/types';
import type { VisualElement } from '../../render/VisualElement.svelte';
import type { CreateVisualElement } from '../../render/types';
import { isRefObject } from '../../utils/is-ref-object.js';
import type { MotionProps } from '../types';
import type { VisualState } from './use-visual-state.svelte';

export function useVisualElement<Instance, RenderState>(
	Component: string | Component,
	visualState: () => VisualState<Instance, RenderState>,
	props: () => MotionProps,
	createVisualElement: CreateVisualElement<Instance> | undefined,
	ProjectionNodeConstructor: () => (new (...args: any[]) => IProjectionNode<unknown>) | undefined
): () => VisualElement<Instance> | null {
	const { visualElement: parent } = $derived(useMotionContext());

	const presenceContext = usePresenceContext();
	const isPresent = $derived(presenceContext?.isPresent);
	const reducedMotionContext = $derived(useMotionConfigContext().reducedMotion);
	const initialLayoutGroupConfig = $derived(useSwitchLayoutGroupContext());

	let visualElement = $state<VisualElement<Instance> | null>(null);

	createVisualElement = createVisualElement || useLazyContext().renderer;

	const getPresenceContextSnapshot = () => (presenceContext ? { ...presenceContext } : null);

	if (!visualElement && createVisualElement) {
		visualElement =
			createVisualElement(Component, {
				visualState: visualState(),
				parent,
				props: props(),
				presenceContext: getPresenceContextSnapshot(),
				blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
				reducedMotionConfig: reducedMotionContext,
			}) ?? null;
	}

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
		!window.MotionHandoffIsComplete?.(optimisedAppearId) &&
		window.MotionHasOptimisedAnimation?.(optimisedAppearId);

	watch.pre([() => visualElement, () => commitVersion], () => {
		if (!visualElement) return;

		isMounted = true;
		window.MotionIsMounted = true;

		tick().then(() => {
			visualElement.updateFeatures();
			microtask.render(visualElement.render);

			if (wantsHandoff && visualElement.animationState) {
				visualElement.animationState.animateChanges();
			}
		});
	});

	watch.pre([() => visualElement, () => commitVersion], () => {
		if (!visualElement) return;

		tick().then(() => {
			if (!wantsHandoff && visualElement.animationState) {
				visualElement.animationState.animateChanges();
			}
		});
		if (wantsHandoff) {
			queueMicrotask(() => {
				window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
			});
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
		props['data-framer-portal-id'] ? undefined : getClosestProjectingNode(visualElement.parent)
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
	visualElement: VisualElement<unknown, unknown, { allowProjection?: boolean }> | null | undefined
): IProjectionNode<unknown> | undefined {
	if (!visualElement) return undefined;

	return visualElement.options.allowProjection !== false
		? visualElement.projection
		: getClosestProjectingNode(visualElement.parent);
}
