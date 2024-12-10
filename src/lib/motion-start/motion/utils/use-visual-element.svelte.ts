/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { fromStore } from 'svelte/store';
import { SwitchLayoutGroupContext, type InitialPromotionConfig } from '../../context/SwitchLayoutGroupContext';
import { LazyContext } from '../../context/LazyContext';
import { MotionConfigContext } from '../../context/MotionConfigContext';
import { MotionContext } from '../../context/MotionContext';
import { PresenceContext } from '../../context/PresenceContext';
import type { VisualElement } from '../../render/VisualElement.svelte';
import type { CreateVisualElement } from '../../render/types';
import type { MotionProps } from '../types';
import type { VisualState } from './use-visual-state';
import type { IProjectionNode } from '../../projection/node/types';
import { isRefObject } from '../../utils/is-ref-object.js';
import { optimizedAppearDataAttribute } from '../../animation/optimized-appear/data-id';
import { microtask } from '../../frameloop/microtask';
import { useContext } from '$lib/motion-start/context/utils/context.svelte';
import { untrack } from 'svelte';

export function useVisualElement<Instance, RenderState>(
	Component: string,
	visualState: VisualState<Instance, RenderState>,
	_props: () => MotionProps,
	createVisualElement?: CreateVisualElement<Instance>,
	ProjectionNodeConstructor?: any,
	isCustom = false
): VisualElement<Instance> | undefined {
	const { visualElement: parent } = $derived(fromStore(useContext(MotionContext, isCustom)).current);

	const lazyContext = $derived(fromStore(useContext(LazyContext, isCustom)).current);

	const presenceContext = $derived(fromStore(useContext(PresenceContext, isCustom)).current);

	const reducedMotionConfig = $derived(fromStore(useContext(MotionConfigContext)).current.reducedMotion);

	let visualElementRef: VisualElement<Instance> | undefined = $state(undefined);

	const props = $derived(_props);

	$inspect(props());

	/**
	 * If we haven't preloaded a renderer, check to see if we have one lazy-loaded
	 */
	createVisualElement = createVisualElement || lazyContext.renderer;

	if (!visualElementRef && createVisualElement) {
		visualElementRef = createVisualElement(Component, {
			visualState,
			parent,
			get props() {
				return props();
			},
			presenceContext,
			blockInitialAnimation: presenceContext?.initial === false,
			reducedMotionConfig,
		});
	}

	const visualElement: VisualElement<Instance> | undefined = $derived(visualElementRef);

	const initialLayoutGroupConfig = $derived(fromStore(useContext(SwitchLayoutGroupContext, isCustom)).current);

	if (
		visualElement &&
		!visualElement.projection &&
		ProjectionNodeConstructor &&
		(visualElement.type === 'html' || visualElement.type === 'svg')
	) {
		createProjectionNode(visualElementRef!, props(), ProjectionNodeConstructor, initialLayoutGroupConfig);
	}

	let isMounted = false;
	$effect.pre(() => {
		isMounted = true;

		/**
		 * Check the component has already mounted before calling
		 * `update` unnecessarily. This ensures we skip the initial update.
		 */
		if (untrack(() => visualElement) && isMounted) {
			untrack(() => visualElement?.update(props(), presenceContext));
		}

		return () => {
			isMounted = false;
		};
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

	$effect(() => {
		console.log('useVisualElement effect');
		if (!visualElement) return;

		isMounted = true;
		window.MotionIsMounted = true;

		untrack(() => visualElement.updateFeatures());
		microtask.render(() => untrack(() => visualElement.render));

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
		if (wantsHandoff && untrack(() => visualElement.animationState)) {
			untrack(() => visualElement.animationState?.animateChanges());
		}

		return () => {
			console.log('useVisualElement effect cleanup');
		};
	});

	$effect(() => {
		if (!visualElement) return;

		if (!wantsHandoff && untrack(() => visualElement.animationState)) {
			untrack(() => visualElement.animationState?.animateChanges());
		}

		if (wantsHandoff) {
			// This ensures all future calls to animateChanges() in this component will run in useEffect
			queueMicrotask(() => {
				window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
			});

			wantsHandoff = false;
		}
	});

	// $effect(() => {
	// 	if (visualElement) {
	// 		visualElement.isPresent = isPresent($presenceContext);
	// 		visualElement.isPresenceRoot = !parent || parent.presenceId !== $presenceContext?.id;

	// 		/**
	// 		 * Fire a render to ensure the latest state is reflected on-screen.
	// 		 */
	// 		visualElement.scheduleRender();
	// 	}
	// });

	// $effect(() => () => {
	// 	visualElement?.notifyUpdate();
	// });

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
