/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { SwitchLayoutGroupContext, type InitialPromotionConfig } from '../../context/SwitchLayoutGroupContext';
import { LazyContext } from '../../context/LazyContext';
import { MotionConfigContext } from '../../context/MotionConfigContext';
import { MotionContext } from '../../context/MotionContext';
import { PresenceContext } from '../../context/PresenceContext';
import type { VisualElement } from '../../render/VisualElement';
import type { CreateVisualElement } from '../../render/types';
import type { MotionProps } from '../types';
import type { VisualState } from './use-visual-state';
import type { IProjectionNode } from '../../projection/node/types';
import { isRefObject } from '../../utils/is-ref-object.js';
import { optimizedAppearDataAttribute } from '../../animation/optimized-appear/data-id';
import { microtask } from '../../frameloop/microtask';
import { useContext } from '../../context/use';
import { tick, untrack } from 'svelte';
import { Debounced, IsMounted, useDebounce, watch } from 'runed';

export function useVisualElement<Instance, RenderState>(
	Component: string,
	visualState: () => VisualState<Instance, RenderState>,
	props: () => MotionProps,
	createVisualElement?: CreateVisualElement<Instance>,
	ProjectionNodeConstructor?: () => any
): VisualElement<Instance> | null {
	const { visualElement: parent } = useContext(MotionContext);

	const lazyContext = useContext(LazyContext);

	const presenceContext = useContext(PresenceContext);

	const reducedMotionContext = $derived(useContext(MotionConfigContext)?.reducedMotion);

	const visualElementRef: { current: VisualElement<Instance> | null } = $state({ current: null });

	/**
	 * If we haven't preloaded a renderer, check to see if we have one lazy-loaded
	 */
	createVisualElement = createVisualElement || lazyContext?.renderer;

	if (!visualElementRef.current && createVisualElement) {
		visualElementRef.current = createVisualElement(Component, {
			visualState: visualState(),
			parent,
			props: props(),
			presenceContext,
			blockInitialAnimation: presenceContext ? presenceContext?.initial === false : false,
			reducedMotionConfig: reducedMotionContext,
		});
	}

	const visualElement = $derived(visualElementRef.current);

	const initialLayoutGroupConfig = useContext(SwitchLayoutGroupContext);

	if (
		visualElement &&
		!visualElement.projection &&
		ProjectionNodeConstructor?.() &&
		(visualElement.type === 'html' || visualElement.type === 'svg')
	) {
		createProjectionNode(visualElementRef.current!, props(), ProjectionNodeConstructor(), initialLayoutGroupConfig);
	}

	const isMounted = new IsMounted();
	$effect.pre(() => {
		/**
		 * Check the component has already mounted before calling
		 * `update` unnecessarily. This ensures we skip the initial update.
		 */
		if (visualElement && isMounted.current) {
			/**
			 * make sure props update but untrack update because scroll and interpolate break from infinite effect call *greater then 9/10 calls.
			 */
			visualElement.update(props(), presenceContext);
		}
	});

	/**
	 * Cache this value as we want to know whether HandoffAppearAnimations
	 * was present on initial render - it will be deleted after this.
	 */
	const optimisedAppearId = props[optimizedAppearDataAttribute as keyof typeof props];
	let wantsHandoff =
		Boolean(optimisedAppearId) &&
		!window.MotionHandoffIsComplete?.(optimisedAppearId) &&
		window.MotionHasOptimisedAnimation?.(optimisedAppearId);

	// $inspect(presenceContext.current);

	$effect(() => {
		$inspect.trace();
		// $inspect(presenceContext);
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
	});

	// watch.pre(
	// 	() => visualElement?.getProps()!,
	// 	(props) => {
	// 		if (!visualElement) return;
	// 		visualElement.update(props, presenceContext);

	// 		visualElement.updateFeatures();
	// 		microtask.render(() => visualElement.render);

	// 		if (!wantsHandoff && visualElement.animationState) {
	// 			visualElement.animationState.animateChanges();
	// 		}
	// 	},
	// 	{
	// 		/**
	// 		 * only fire on changes...
	// 		 * this only fires on changes in props
	// 		 */
	// 		lazy: true,
	// 	}
	// );

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

	// watch(
	// 	() => presenceContext.current,
	// 	() => {
	// 		visualElement?.updateFeatures();

	// 		microtask.render(() => visualElement.render);
	// 	},
	// 	{ lazy: true }
	// );

	return visualElement;
}

function createProjectionNode(
	visualElement: VisualElement<any>,
	props: MotionProps,
	ProjectionNodeConstructor: any,
	initialPromotionConfig?: InitialPromotionConfig
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
	visualElement?: VisualElement<unknown, unknown, { allowProjection?: boolean }>
): IProjectionNode<unknown> | undefined {
	if (!visualElement) return undefined;

	return visualElement.options.allowProjection !== false
		? visualElement.projection
		: getClosestProjectingNode(visualElement.parent);
}
