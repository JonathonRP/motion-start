/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { watch } from 'runed';
import type { Component, ComponentProps, Snippet } from 'svelte';
import { useLayoutGroupContext } from '../context/LayoutGroupContext.svelte.js';
import { useLazyContext } from '../context/LazyContext.js';
import { useMotionConfigContext } from '../context/MotionConfigContext.svelte.js';
import { setMotionContext, useMotionContext } from '../context/MotionContext/index.js';
import { useCreateMotionContext } from '../context/MotionContext/create.svelte.js';
import { optimizedAppearDataAttribute } from '../animation/optimized-appear/data-id.js';
import type { CreateVisualElement } from '../render/types.js';
import { invariant, warning } from '../utils/errors.js';
import type { Ref } from '../utils/safe-react-types.js';
import { featureDefinitions } from './features/definitions.js';
import { loadFeatures } from './features/load-features.js';
import type { RenderComponent, FeatureBundle } from './features/types.js';
import type { MotionProps } from './types.js';
import { useMotionRef } from './utils/use-motion-ref.svelte.js';
import type { UseVisualState } from './utils/use-visual-state.svelte.js';
import { motionComponentSymbol } from './utils/symbol.js';
import { useVisualElement } from './utils/use-visual-element.svelte.js';
import MeasureLayoutRenderer from './MeasureLayoutRenderer.svelte';
import MotionScope from './MotionScope.svelte';

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

	const renderMotionComponent = (
		anchor: Parameters<Component>[0],
		props: MotionComponentProps<Props> & { ref?: Ref<Instance> },
		scopeId: string
	) => {
		/**
		 * `appear` needs a hydration-stable id on both the rendered element (so the
		 * inline bootstrap can find its own animation) and in the VisualElement's
		 * props (so `MotionHandoffAnimation` can look it up). Merging it in once
		 * here keeps both consumers reading the same value; components without
		 * `appear` keep the original props object untouched.
		 */
		const motionProps = $derived.by(() => {
			if (!props.appear || props[optimizedAppearDataAttribute]) return props;

			return {
				...props,
				[optimizedAppearDataAttribute]: `motion-${scopeId}`,
			};
		});
		const motionConfig = $derived.by(useMotionConfigContext);
		const configAndProps = $derived.by(() => {
			const propsState = $state({
				...motionConfig,
				...motionProps,
				layoutId: useLayoutId(() => motionProps),
			});
			return propsState;
		});

		const { isStatic } = $derived(configAndProps);

		const parentContext = useMotionContext();

		const context = $derived.by(useCreateMotionContext<Instance>(() => motionProps, parentContext));

		// Call useVisualState once — mirrors React's useConstant pattern.
		// visualState.latestValues is taken by reference by VisualElement and mutated
		// in-place during animation. Re-calling on every props change creates a new
		// empty latestValues object, causing UseRender to write style="" and flash.
		const visualState = useVisualState(
			() => motionProps,
			() => isStatic
		);

		const layoutProjection = $derived.by(() => getProjectionFunctionality(() => configAndProps));
		/**
		 * If we need to measure the element we load this functionality in a
		 * separate class component in order to gain access to getSnapshotBeforeUpdate.
		 */
		const MeasureLayout = $derived(layoutProjection.MeasureLayout);

		const visualElement = $derived.by(
			useVisualElement<Instance, RenderState>(
				Component,
				() => visualState,
				() => configAndProps,
				createVisualElement,
				() => layoutProjection.ProjectionNode,
				parentContext
			)
		);

		useStrictMode(() => configAndProps, preloadedFeatures);

		setMotionContext({
			get visualElement() {
				return visualElement;
			},
			get initial() {
				return context.initial;
			},
			get animate() {
				return context.animate;
			},
		});

		// Keep context in sync with the current visual element before commit.
		watch.pre([() => visualElement], () => {
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

		let rendererInstance: Record<string, any> | null = null;

		rendererInstance = useRender(anchor, {
			get Component() {
				return Component;
			},
			get props() {
				return motionProps;
			},
			get ref() {
				return useMotionRef<Instance, RenderState>(visualState, context.visualElement, motionProps.ref);
			},
			get visualState() {
				return visualState;
			},
			get isStatic() {
				return isStatic;
			},
			get visualElement() {
				return context.visualElement ?? undefined;
			},
		});

		const measureProps = $derived.by(() => ({
			...configAndProps,
			visualElement: context.visualElement ?? undefined,
		}));

		// Let Svelte own the dynamic component branch so its lifecycle is torn
		// down when layout/drag features disappear and recreated on replacement.
		MeasureLayoutRenderer(anchor, {
			get MeasureLayout() {
				return MeasureLayout;
			},
			get measureProps() {
				return measureProps;
			},
		});

		return rendererInstance;
	};

	/**
	 * `MotionScope` is a compiled component, so initialising the motion body inside
	 * it gives every motion component its own context scope. See `MotionScope.svelte`
	 * for why that matters.
	 */
	const MotionComponent: Component<MotionComponentProps<Props> & { ref?: Ref<Instance> }> = (anchor, props) => {
		const instance: { current: Record<string, any> | null } = { current: null };

		MotionScope(anchor, {
			run: (scopeId: string) => {
				instance.current = renderMotionComponent(anchor, props, scopeId);
			},
		});

		// `run` executes synchronously during MotionScope's initialisation, so the
		// instance is always populated by the time we return it.
		return instance.current!;
	};

	(MotionComponent as any)[motionComponentSymbol] = Component;
	return MotionComponent;
};

export function useLayoutId(props: () => MotionProps) {
	const { layoutId } = props();
	const { id: layoutGroupId } = useLayoutGroupContext() ?? {};

	return layoutGroupId && layoutId !== undefined ? `${layoutGroupId}-${layoutId}` : layoutId;
}

export function useStrictMode(configAndProps: () => MotionProps, preloadedFeatures?: FeatureBundle) {
	const { strict: isStrict } = useLazyContext();

	/**
	 * If we're in development mode, check to make sure we're not rendering a motion component
	 * as a child of LazyMotion, as this will break the file-size benefits of using it.
	 */
	if (process.env.NODE_ENV !== 'production' && preloadedFeatures && isStrict) {
		const strictMessage =
			'You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.';
		configAndProps().ignoreStrict ? warning(false, strictMessage) : invariant(false, strictMessage);
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
