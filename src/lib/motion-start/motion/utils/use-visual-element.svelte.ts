/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { watch } from 'runed';
import { tick, untrack, type Component } from 'svelte';
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
import { featureDefinitions } from '../features/definitions';
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
	// Fine-grained derived on isPresent so in-place mutations to the $state context object
	// cause watch.pre to re-fire (object reference never changes — only the property does).
	const isPresent = $derived(presenceContext?.isPresent);
	const reducedMotionContext = $derived(useMotionConfigContext().reducedMotion);
	const initialLayoutGroupConfig = $derived(useSwitchLayoutGroupContext());

	let visualElement = $state<VisualElement<Instance> | null>(null);

	createVisualElement = createVisualElement || useLazyContext().renderer;

	if (!visualElement && createVisualElement) {
		visualElement =
			createVisualElement(Component, {
				visualState: visualState(),
				parent,
				props: props(),
				get presenceContext() {
					return presenceContext;
				},
				get blockInitialAnimation() {
					return presenceContext ? presenceContext.initial === false : false;
				},
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

	// Track mount state via $effect.pre so it's set in the render phase,
	// consistent with $effect.pre effects that check it (avoids IsMounted's
	// $effect deferral problem in raw component functions on remount).
	let isMounted = $state(false);

	// Unified watcher for props + presence changes — mirrors React's per-render
	// useInsertionEffect (update) + useIsomorphicLayoutEffect (updateFeatures) + useEffect (animateChanges).
	// Keeping props and isPresent in the same watcher ensures they're evaluated atomically:
	// if isPresent→false happens in the same flush as a props change, exit fires synchronously
	// before tick() resolves, so the isPresent !== false guard correctly skips animateChanges.
	watch.pre(
		[() => props(), () => isPresent],
		() => {
			if (!visualElement?.current || !isMounted) return;
			visualElement.update(props(), presenceContext);
			let fKey: keyof typeof featureDefinitions = 'animation';
			for (fKey in featureDefinitions) {
				visualElement.features[fKey]?.update();
			}
			tick().then(() => {
				if (!wantsHandoff && visualElement.animationState && isPresent) {
					visualElement.animationState.animateChanges();
				}
			});
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

		// Mount or update all features declaratively (replaces updateFeatures()).
		let fKey: keyof typeof featureDefinitions = 'animation';
		for (fKey in featureDefinitions) {
			const featureDefinition = featureDefinitions[fKey];
			if (!featureDefinition) continue;
			const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
			if (!visualElement.features[fKey] && FeatureConstructor && untrack(() => isEnabled(visualElement.props))) {
				visualElement.features[fKey] = new FeatureConstructor(visualElement as VisualElement<HTMLElement>) as any;
			}
			const feature = visualElement.features[fKey];
			if (feature) {
				if (feature.isMounted) {
					feature.update();
				} else {
					feature.mount();
					feature.isMounted = true;
				}
			}
		}

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
			if (!untrack(() => wantsHandoff) && visualElement.animationState && isPresent) {
				visualElement.animationState.animateChanges();
			}
		});

		untrack(() => {
			if (wantsHandoff) {
				// This ensures all future calls to animateChanges() in this component will run in useEffect
				queueMicrotask(() => {
					window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
				});

				wantsHandoff = false;
			}
		});

		return () => {
			let fKey: keyof typeof visualElement.features = 'animation';
			for (fKey in visualElement.features) {
				const feature = visualElement.features[fKey];
				if (feature?.isMounted) {
					feature.unmount();
					feature.isMounted = false;
				}
			}
		};
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
