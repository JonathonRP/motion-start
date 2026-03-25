/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Component, ComponentProps, Snippet } from 'svelte';
import { useLayoutGroupContext } from '../context/LayoutGroupContext.svelte';
import { useLazyContext } from '../context/LazyContext';
import { useMotionConfigContext } from '../context/MotionConfigContext.svelte';
import { useCreateMotionContext } from '../context/MotionContext/create.svelte';
import type { CreateVisualElement } from '../render/types';
import { invariant, warning } from '../utils/errors';
import type { Ref } from '../utils/safe-react-types';
import { featureDefinitions } from './features/definitions';
import { loadFeatures } from './features/load-features';
import type { RenderComponent, FeatureBundle } from './features/types';
import type { MotionProps } from './types';
import { useMotionRef } from './utils/use-motion-ref.svelte';
import type { UseVisualState } from './utils/use-visual-state.svelte';
import { motionComponentSymbol } from './utils/symbol';
import { useVisualElement } from './utils/use-visual-element.svelte';

export interface MotionComponentConfig<Instance, RenderState> {
	preloadedFeatures?: FeatureBundle;
	createVisualElement?: CreateVisualElement<Instance>;
	useRender: RenderComponent<Instance, RenderState>;
	useVisualState: UseVisualState<Instance, RenderState>;
	Component: string | Component<ComponentProps<Component> & { children: Snippet | Component }>;
}

export type MotionComponentProps<Props> = {
	[K in Exclude<keyof Props, keyof MotionProps>]?: Props[K];
} & MotionProps;

/**
 * Create a `motion` component.
 *
 * This function accepts a Component argument, which can be either a string (ie "div"
 * for `MotionDiv`), or an actual Svelte component.
 *
 * Alongside this is a config option which provides a way of rendering the provided
 * component "offline", or outside the React render cycle.
 *
 * @internal
 */
export const createRendererMotionComponent = <Props extends {}, Instance, RenderState>({
	preloadedFeatures,
	createVisualElement,
	useRender,
	useVisualState,
	Component,
}: MotionComponentConfig<Instance, RenderState>) => {
	preloadedFeatures && loadFeatures(preloadedFeatures);

	const MotionComponent: Component<MotionComponentProps<Props> & { ref?: Ref<Instance> }> = (anchor, props) => {
		/**
		 * If we need to measure the element we load this functionality in a
		 * separate class component in order to gain access to getSnapshotBeforeUpdate.
		 */
		let MeasureLayout: undefined | Component<MotionProps> = $state(undefined);

		const motionConfig = $derived.by(useMotionConfigContext);
		const configAndProps = $derived({
			...motionConfig,
			...props,
			layoutId: useLayoutId(() => props),
		});

		const { isStatic } = $derived(configAndProps);

		const context = $derived.by(useCreateMotionContext<Instance>(() => props));

		const visualState = $derived.by(() => useVisualState(() => props, isStatic)());

		const layoutProjection = $derived.by(() => getProjectionFunctionality(() => configAndProps));

		const visualElement = $derived.by(
			useVisualElement<Instance, RenderState>(
				Component,
				() => visualState,
				() => configAndProps,
				createVisualElement,
				() => layoutProjection.ProjectionNode
			)
		);

		useStrictMode(configAndProps, preloadedFeatures);

		// Keep context and MeasureLayout in sync with derived values
		$effect.pre(() => {
			MeasureLayout = layoutProjection.MeasureLayout;
		});
		$effect.pre(() => {
			context.visualElement = visualElement;
		});

		// $effect(() => {
		// 	// MotionContext.Provider
		// 	MotionContext.Provider = context;
		// 	return () => {
		// 		// Since useMotionRef is not called on destroy, the visual element is unmounted here
		// 		context.visualElement?.unmount();
		// 	};
		// });

		let _measureInstance: Record<string, any> | null = null;
		let rendererInstance: Record<string, any> | null = null;

		rendererInstance = useRender(anchor, {
			get Component() {
				return Component;
			},
			get props() {
				return props;
			},
			get ref() {
				return useMotionRef<Instance, RenderState>(visualState, context.visualElement, props.ref);
			},
			get visualState() {
				return visualState;
			},
			get isStatic() {
				return isStatic;
			},
			get visualElement() {
				return visualElement ?? undefined;
			},
		});

		// Mount MeasureLayout once and keep it alive — do NOT recreate it on every prop change.
		// Recreating would reset prevLayoutDependency in MeasureLayoutWithContext, breaking FLIP.
		// Stable $state object updated on every configAndProps change.
		// $state makes fields reactive so MeasureLayoutWithContext's watch.pre re-fires correctly.
		const measureProps = $state({
			...configAndProps,
			visualElement: context.visualElement ?? null,
		});
		$effect.pre(() => {
			Object.assign(measureProps, configAndProps, {
				visualElement: context.visualElement ?? null,
			});
		});
		$effect.pre(() => {
			if (MeasureLayout && context.visualElement && !_measureInstance) {
				_measureInstance = MeasureLayout(anchor, measureProps as unknown as MotionProps);
			}
		});

		return rendererInstance;
	};

	(MotionComponent as any)[motionComponentSymbol] = Component;
	return MotionComponent;
};

export function useLayoutId(props: () => MotionProps) {
	const { layoutId } = props();
	const { id: layoutGroupId } = useLayoutGroupContext() ?? {};

	return layoutGroupId && layoutId !== undefined ? `${layoutGroupId}-${layoutId}` : layoutId;
}

export function useStrictMode(configAndProps: MotionProps, preloadedFeatures?: FeatureBundle) {
	const { strict: isStrict } = useLazyContext();

	/**
	 * If we're in development mode, check to make sure we're not rendering a motion component
	 * as a child of LazyMotion, as this will break the file-size benefits of using it.
	 */
	if (process.env.NODE_ENV !== 'production' && preloadedFeatures && isStrict) {
		const strictMessage =
			'You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.';
		configAndProps.ignoreStrict ? warning(false, strictMessage) : invariant(false, strictMessage);
	}
}

export function getProjectionFunctionality(props: () => MotionProps): {
	MeasureLayout?: any;
	ProjectionNode?: any;
} {
	const { drag, layout } = featureDefinitions;

	if (!drag && !layout) return {};

	const combined = { ...drag, ...layout };

	return {
		MeasureLayout: drag?.isEnabled(props()) || layout?.isEnabled(props()) ? combined.MeasureLayout : undefined,
		ProjectionNode: combined.ProjectionNode,
	};
}
