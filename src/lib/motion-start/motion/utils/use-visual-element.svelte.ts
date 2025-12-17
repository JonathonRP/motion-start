/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { IsMounted } from 'runed';
import { untrack } from 'svelte';
import { optimizedAppearDataAttribute } from '../../animation/optimized-appear/data-id';
import { LazyContext } from '../../context/LazyContext';
import { useMotionConfig } from '../../context/MotionConfigContext.svelte';
import { MotionContext } from '../../context/MotionContext';
import { usePresenceContext } from '../../context/PresenceContext.svelte';
import { SwitchLayoutGroupContext, type InitialPromotionConfig } from '../../context/SwitchLayoutGroupContext';
import { microtask } from '../../frameloop/microtask';
import type { IProjectionNode } from '../../projection/node/types';
import { VisualElement } from '../../render/VisualElement.svelte';
import type { CreateVisualElement } from '../../render/types';
import { isRefObject } from '../../utils/is-ref-object.js';
import { ref } from '../../utils/ref.svelte';
import type { MotionProps } from '../types';
import type { VisualState } from './use-visual-state.svelte';

export function useVisualElement<Instance, RenderState>(
	Component: string,
	visualState: () => VisualState<Instance, RenderState>,
	props: () => MotionProps,
	createVisualElement?: CreateVisualElement<Instance>,
	ProjectionNodeConstructor?: new (...args: any[]) => IProjectionNode<unknown>
): VisualElement<Instance> | null {
	const { visualElement: parent } = MotionContext.getOr(null) || {};

	const lazyContext = LazyContext.getOr({ strict: false } as any);

	const presenceContext = $derived(usePresenceContext().current);

	const reducedMotionContext = $derived(useMotionConfig().reducedMotion);

	const visualElementRef = ref<VisualElement<Instance> | null>(null);

	/**
	 * If we haven't preloaded a renderer, check to see if we have one lazy-loaded
	 */
	createVisualElement = createVisualElement || lazyContext.renderer;

	if (!visualElementRef.current && createVisualElement) {
		visualElementRef.current = createVisualElement(Component, {
			get visualState() {
				return visualState();
			},
			parent,
			get props() {
				return props();
			},
			presenceContext,
			blockInitialAnimation: presenceContext ? presenceContext?.initial === false : false,
			reducedMotionConfig: reducedMotionContext,
		});
	}

	const visualElement = $derived(visualElementRef.current);

	$inspect(visualElement);

	const initialLayoutGroupConfig = SwitchLayoutGroupContext.getOr({});

	if (
		visualElement &&
		!visualElement.projection &&
		ProjectionNodeConstructor &&
		(visualElement.type === 'html' || visualElement.type === 'svg')
	) {
		createProjectionNode(visualElementRef.current!, props(), ProjectionNodeConstructor, initialLayoutGroupConfig);
	}

	const isMounted = new IsMounted();
	$inspect(presenceContext);

	$effect.pre(() => {
		props();
		presenceContext;
		/**
		 * Check the component has already mounted before calling
		 * `update` unnecessarily. This ensures we skip the initial update.
		 */
		if (visualElement && isMounted.current) {
			/**
			 * make sure props update but untrack update because scroll and interpolate break from infinite effect call *greater then 9/10 calls.
			 */
			untrack(() => {
				visualElement.update(props, () => presenceContext);
				// Trigger exit animation feature update when presence context changes
				if (visualElement.features.animation) {
					visualElement.features.animation.update();
				}
			});
		}
	});

	/**
	 * Cache this value as we want to know whether HandoffAppearAnimations
	 * was present on initial render - it will be deleted after this.
	 */
	const optimisedAppearId = $derived.by(() => props()[optimizedAppearDataAttribute as keyof typeof props]);
	let wantsHandoff = $derived(
		Boolean(optimisedAppearId) &&
		!window.MotionHandoffIsComplete?.(optimisedAppearId) &&
		window.MotionHasOptimisedAnimation?.(optimisedAppearId));

	$effect(() => {
		if (!visualElement) return;

		window.MotionIsMounted = true;

		visualElement.updateFeatures();
		microtask.render(() => visualElement.render);

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
		if (wantsHandoff && visualElement.animationState) {
			visualElement.animationState.animateChanges();
		}

		// return () => {
		// 	visualElement.updateFeatures();
		// 	console.log('dismounting');
		// 	visualElement.unmount();
		// };
	});

	$effect(() => {
		if (!visualElement) return;

		if (!wantsHandoff && visualElement.animationState) {
			visualElement.animationState.animateChanges();
		}

		if (wantsHandoff) {
			// This ensures all future calls to animateChanges() in this component will run in useEffect
			queueMicrotask(() => {
				window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
			});

			wantsHandoff = false;
		}
	});

	return visualElement;
}

function createProjectionNode(
	visualElement: VisualElement<any>,
	props: MotionProps,
	ProjectionNodeConstructor: { new (...args: any[]): IProjectionNode<unknown> },
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
		visualElement,
		/**
		 * TODO: Update options in an effect. This could be tricky as it'll be too late
		 * to update by the time layout animations run.
		 * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
		 * ensuring it gets called if there's no potential layout animations.
		 *
		 */
		animationType: typeof layout === 'string' ? layout : 'both',
		initialPromotionConfig,
		layoutScroll,
		layoutRoot,
	});
}

function getClosestProjectingNode(
	visualElement?: VisualElement<unknown, unknown, { allowProjection?: boolean }> | null
): IProjectionNode<unknown> | undefined {
	if (!visualElement) return undefined;

	return visualElement.options.allowProjection !== false
		? visualElement.projection
		: getClosestProjectingNode(visualElement.parent);
}
