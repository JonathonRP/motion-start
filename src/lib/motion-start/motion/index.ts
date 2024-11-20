/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { getContext, onDestroy, setContext, tick, type Component } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';
import type { MotionProps } from './types';
import type { RenderComponent, FeatureBundle } from './features/types';
import { MotionConfigContext } from '../context/MotionConfigContext';
import { MotionContext } from '../context/MotionContext';
import { useVisualElement } from './utils/use-visual-element';
import type { UseVisualState } from './utils/use-visual-state';
import { useMotionRef } from './utils/use-motion-ref';
import { useCreateMotionContext } from '../context/MotionContext/create';
import { loadFeatures } from './features/load-features';
import { isBrowser } from '../utils/is-browser';
import { LayoutGroupContext, type LayoutGroupContextProps } from '../context/LayoutGroupContext';
import { LazyContext, type LazyContextProps } from '../context/LazyContext';
import { motionComponentSymbol } from './utils/symbol';
import type { CreateVisualElement } from '../render/types';
import { invariant, warning } from '../utils/errors';
import { featureDefinitions } from './features/definitions';
import Motion from './Motion.svelte';
import type { Ref } from '../utils/is-ref-object';
import { setDomContext } from '../context/DOMcontext';
import type { MeasureLayout } from './features/layout/MeasureLayout';

export interface MotionComponentConfig<Instance, RenderState> {
	preloadedFeatures?: FeatureBundle;
	createVisualElement?: CreateVisualElement<Instance>;
	useRender: RenderComponent<Instance, RenderState>;
	useVisualState: UseVisualState<Instance, RenderState>;
	Component: string;
}

export type MotionComponentProps<Props> = {
	[K in Exclude<keyof Props, keyof MotionProps>]?: Props[K];
} & MotionProps;

/**
 * Create a `motion` component.
 *
 * This function accepts a Component argument, which can be either a string (ie "div"
 * for `MotionDiv`), or an actual React component.
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

	const MotionComponent = (
		...[anchor, { props, externalRef }, ...options]: Parameters<
			Component<{ props: MotionComponentProps<Props>; externalRef?: Ref<Instance> }>
		>
	) => {
		/**
		 * If we need to measure the element we load this functionality in a
		 * separate class component in order to gain access to getSnapshotBeforeUpdate.
		 */
		let useMeasureLayout: undefined | typeof MeasureLayout;
		const mcc = getContext<Writable<MotionConfigContext>>(MotionConfigContext) || MotionConfigContext(Component);

		const configAndProps = {
			...get(mcc),
			...props,
			layoutId: useLayoutId(props),
		};

		const { isStatic } = configAndProps;

		const context = useCreateMotionContext<Instance>(props);

		const visualState = useVisualState(props, isStatic);

		if (!isStatic && isBrowser) {
			useStrictMode(configAndProps, preloadedFeatures);

			const layoutProjection = getProjectionFunctionality(configAndProps);
			useMeasureLayout = layoutProjection.MeasureLayout;

			/**
			 * Create a VisualElement for this component. A VisualElement provides a common
			 * interface to renderer-specific APIs (ie DOM/Three.js etc) as well as
			 * providing a way of rendering to these APIs outside of the React render loop
			 * for more performant animations and interactions
			 */
			context.visualElement = useVisualElement<Instance, RenderState>(
				Component,
				visualState,
				configAndProps,
				createVisualElement,
				layoutProjection.ProjectionNode
			);
		}

		// MotionContext.Provider
		const store = writable(context);
		tick().then(() => {
			const configAndProps = {
				...get(mcc),
				...props,
				layoutId: useLayoutId(props),
			};

			const { isStatic } = configAndProps;

			const context = useCreateMotionContext<Instance>(props);

			const visualState = useVisualState(props, isStatic);

			if (!isStatic && isBrowser) {
				useStrictMode(configAndProps, preloadedFeatures);

				const layoutProjection = getProjectionFunctionality(configAndProps);
				useMeasureLayout = layoutProjection.MeasureLayout;

				/**
				 * Create a VisualElement for this component. A VisualElement provides a common
				 * interface to renderer-specific APIs (ie DOM/Three.js etc) as well as
				 * providing a way of rendering to these APIs outside of the React render loop
				 * for more performant animations and interactions
				 */
				context.visualElement = useVisualElement<Instance, RenderState>(
					Component,
					visualState,
					configAndProps,
					createVisualElement,
					layoutProjection.ProjectionNode
				);
			}

			store.set(context);
		});
		setContext(MotionContext, store);
		setDomContext('Motion', Component, store);

		// Since useMotionRef is not called on destroy, the visual element is unmounted here
		onDestroy(() => {
			context?.visualElement?.unmount();
		});

		return [
			useMeasureLayout && context.visualElement
				? useMeasureLayout({ visualElement: context.visualElement, ...configAndProps })
				: null,
			useRender(
				Component,
				props,
				useMotionRef<Instance, RenderState>(visualState, context.visualElement, externalRef),
				visualState,
				isStatic,
				context.visualElement
			),
		].join('');

		// return Motion(
		// 	anchor,
		// 	{
		// 		UseRender: useRender(
		// 			Component,
		// 			props,
		// 			useMotionRef<Instance, RenderState>(visualState, context.visualElement, externalRef),
		// 			visualState,
		// 			isStatic,
		// 			context.visualElement
		// 		),
		// 		MeasureLayout:
		// 			MeasureLayout && context.visualElement
		// 				? new Proxy(MeasureLayout, {
		// 						get(target, _key, args) {
		// 							if (!args[1]) {
		// 								args[1] = { visualElement: context.visualElement, ...configAndProps };
		// 							} else {
		// 								args[1] = {
		// 									...args[1],
		// 									visualElement: context.visualElement,
		// 									...configAndProps,
		// 								};
		// 							}

		// 							// @ts-expect-error
		// 							return target(...args);
		// 						},
		// 					})
		// 				: undefined,
		// 	},
		// 	...options
		// );
	};

	MotionComponent[motionComponentSymbol] = Component;
	return MotionComponent;
};

function useLayoutId({ layoutId }: MotionProps, isCustom = false) {
	const layoutGroupId = get(
		getContext<Writable<LayoutGroupContextProps>>(LayoutGroupContext) || LayoutGroupContext(isCustom)
	).id;
	return layoutGroupId && layoutId !== undefined ? layoutGroupId + '-' + layoutId : layoutId;
}

function useStrictMode(configAndProps: MotionProps, preloadedFeatures?: FeatureBundle, isCustom = false) {
	const isStrict = get(getContext<Writable<LazyContextProps>>(LazyContext) || LazyContext(isCustom)).strict;

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

function getProjectionFunctionality(props: MotionProps) {
	const { drag, layout } = featureDefinitions;

	if (!drag && !layout) return {};

	const combined = { ...drag, ...layout };

	return {
		MeasureLayout: drag?.isEnabled(props) || layout?.isEnabled(props) ? combined.MeasureLayout : undefined,
		ProjectionNode: combined.ProjectionNode,
	};
}
