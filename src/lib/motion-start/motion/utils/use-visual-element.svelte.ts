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
import { ref } from '../../utils/ref.svelte';
import type { MotionProps } from '../types';
import type { VisualState } from './use-visual-state.svelte';

export function useVisualElement<Instance, RenderState>(
	Component: string | Component,
	visualState: () => VisualState<Instance, RenderState>,
	props: () => MotionProps,
	createVisualElement: CreateVisualElement<Instance> | undefined,
	ProjectionNodeConstructor: () => (new (...args: any[]) => IProjectionNode<unknown>) | undefined
): () => VisualElement<Instance> | null {
	const { visualElement: parent } = $derived(useMotionContext().current);

	const lazyContext = $derived(useLazyContext().current);

	// Keep the ref so visualElement.update() always receives the live $state object —
	// PopChildMeasure mutates context.measurePop in place and we must see that mutation.
	const presenceContext = usePresenceContext();
	// Track isPresent as a fine-grained derived so mutations to that property (in-place
	// on the same $state object) invalidate the watch.pre below.
	const isPresent = $derived(presenceContext.current?.isPresent);

	const reducedMotionContext = $derived(useMotionConfigContext().current.reducedMotion);

	const visualElementRef = ref<VisualElement<Instance> | null>(null);

	/**
	 * If we haven't preloaded a renderer, check to see if we have one lazy-loaded
	 */
	createVisualElement = createVisualElement || lazyContext.renderer;

	if (!visualElementRef.current && createVisualElement) {
		visualElementRef.current =
			createVisualElement(Component, {
				visualState: visualState(),
				parent,
				props: props(),
				get presenceContext() {
					return presenceContext.current;
				},
				get blockInitialAnimation() {
					return presenceContext.current ? presenceContext.current.initial === false : false;
				},
				reducedMotionConfig: reducedMotionContext,
			}) ?? null;
	}

	const visualElement = $derived(visualElementRef.current);

	const initialLayoutGroupConfig = $derived(useSwitchLayoutGroupContext().current);

	$effect.pre(() => {
		if (
			visualElement &&
			!visualElement.projection &&
			ProjectionNodeConstructor() &&
			(visualElement.type === 'html' || visualElement.type === 'svg')
		) {
			createProjectionNode(visualElementRef.current!, props(), ProjectionNodeConstructor()!, initialLayoutGroupConfig);
		}
	});

	// Track mount state via $effect.pre so it's set in the render phase,
	// consistent with $effect.pre effects that check it (avoids IsMounted's
	// $effect deferral problem in raw component functions on remount).
	let isMounted = $state(false);

	// Fires when props, presenceContext, isMounted, or visualElement change.
	// isMounted in sources ensures update() is called immediately on mount (not just on prop changes).
	watch.pre(
		[() => props(), () => presenceContext.current, () => isMounted, () => visualElement],
		() => {
			if (visualElement && isMounted) {
				visualElement.update(props(), presenceContext.current);
			}
		},
		{ lazy: true }
	);

	// Lazy: only fire when isPresent changes (not on initial mount).
	// isPresent is a fine-grained $derived on the property — tracks in-place mutations
	// to the $state context object in PresenceChild.
	watch.pre(
		() => isPresent,
		() => {
			if (isMounted) {
				if (visualElement?.current) {
					tick().then(() => {
						if (visualElement.current) visualElement.updateFeatures();
					});
				}
			}
		},
		{ lazy: true }
	);

	/**
	 * Cache this value as we want to know whether HandoffAppearAnimations
	 * was present on initial render - it will be deleted after this.
	 */
	const optimisedAppearId = $derived(props()[optimizedAppearDataAttribute as keyof ReturnType<typeof props>]);
	let wantsHandoff = $derived(
		Boolean(optimisedAppearId) &&
			!window.MotionHandoffIsComplete?.(optimisedAppearId) &&
			window.MotionHasOptimisedAnimation?.(optimisedAppearId)
	);

	$effect.pre(() => {
		if (!visualElement?.current) return;

		isMounted = true;
		window.MotionIsMounted = true;

		visualElement.updateFeatures();
		microtask.render(visualElement.render);

		/**
		 * Ideally this function would always run in a useEffect.
		 *
		 * However, if we have optimised appear animations to handoff from,
		 * it needs to happen synchronously to ensure there's no flash of
		 * incorrect styles in the event of a hydration error.
		 *
		 * So if we detect a situtation where optimised appear animations
		 * are running, we use useLayoutEffect to trigger animations.
		 */
		tick().then(() => {
			if (!wantsHandoff && visualElement.animationState) {
				visualElement.animationState.animateChanges();
			}
		});

		if (wantsHandoff) {
			// This ensures all future calls to animateChanges() in this component will run in useEffect
			queueMicrotask(() => {
				window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
			});

			wantsHandoff = false;
		}
	});

	// Lazy: re-run animateChanges on prop changes after mount.
	watch.pre(
		() => props(),
		() => {
			if (!visualElement?.current) return;
			tick().then(() => {
				if (wantsHandoff && visualElement.animationState) {
					visualElement.animationState.animateChanges();
				}
			});
		},
		{ lazy: true }
	);

	return () => visualElement;
}

function createProjectionNode(
	visualElement: VisualElement<any>,
	props: MotionProps,
	ProjectionNodeConstructor: new (...args: any[]) => IProjectionNode<unknown>,
	initialPromotionConfig?: InitialPromotionConfig
) {
	const { layoutId, layout, drag, dragConstraints, layoutScroll, layoutRoot } = props;

	visualElement.projection = new ProjectionNodeConstructor(
		visualElement.latestValues,
		props['data-framer-portal-id'] ? undefined : getClosestProjectingNode(visualElement.parent)
	) as IProjectionNode<unknown>;

	visualElement.projection.setOptions({
		layoutId,
		layout: typeof layout === 'boolean' || typeof layout === 'string' ? layout : undefined,
		alwaysMeasureLayout: Boolean(drag) || (dragConstraints && isRefObject(dragConstraints)),
		get visualElement() {
			return visualElement;
		},
		/**
		 * TODO: Update options in an effect. This could be tricky as it'll be too late
		 * to update by the time layout animations run.
		 * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
		 * ensuring it gets called if there's no potential layout animations.
		 *
		 */
		animationType: typeof layout === 'string' ? (layout as 'size' | 'position' | 'both' | 'preserve-aspect') : 'both',
		initialPromotionConfig,
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
