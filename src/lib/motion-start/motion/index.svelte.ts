/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import {
	createRawSnippet,
	flushSync,
	getContext,
	hydrate,
	mount,
	onDestroy,
	setContext,
	tick,
	unmount,
	untrack,
	type Component,
	type Snippet,
} from 'svelte';
import { render } from 'svelte/server';
import { fromStore, get } from 'svelte/store';
import type { MotionProps } from './types';
import type { RenderComponent, FeatureBundle } from './features/types';
import { MotionConfigContext } from '../context/MotionConfigContext';
import { MotionContext } from '../context/MotionContext';
import { useVisualElement } from './utils/use-visual-element.svelte';
import type { UseVisualState } from './utils/use-visual-state';
import { useMotionRef } from './utils/use-motion-ref';
import { useCreateMotionContext } from '../context/MotionContext/create.svelte';
import { loadFeatures } from './features/load-features';
import { isBrowser } from '../utils/is-browser';
import { LayoutGroupContext } from '../context/LayoutGroupContext';
import { LazyContext } from '../context/LazyContext';
import { motionComponentSymbol } from './utils/symbol';
import type { CreateVisualElement } from '../render/types';
import { invariant, warning } from '../utils/errors';
import { featureDefinitions } from './features/definitions';
import Motion from './Motion.svelte';
import type { Ref } from '../utils/safe-react-types';
import { useContext } from '../context/utils/context.svelte';

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
export const createRendererMotionComponent = <Props extends {} = MotionProps, Instance, RenderState>({
	preloadedFeatures,
	createVisualElement,
	useRender,
	useVisualState,
	Component,
}: MotionComponentConfig<Instance, RenderState>) => {
	preloadedFeatures && loadFeatures(preloadedFeatures);
	setContext('motion', { createVisualElement, useRender, useVisualState, Component, preloadedFeatures });

	// const MotionComponent: Component<
	// 	MotionComponentProps<Props> & { externalRef?: Ref<Instance> | undefined; ref?: Instance | null | undefined }
	// > = (anchor, _props) => {
	// let { externalRef, ref, children, ...props } = $derived(_props);
	// const props = () =>
	// 	new Proxy(restProps, {
	// 		get(target, key: keyof typeof restProps) {
	// 			return target[key];
	// 		},
	// 		set(target, key: keyof typeof restProps, value) {
	// 			target[key] = value;
	// 		},
	// 	});

	/**
	 * If we need to measure the element we load this functionality in a
	 * separate class component in order to gain access to getSnapshotBeforeUpdate.
	 */
	// let MeasureLayout: undefined | Component<MotionProps> = $state(undefined);

	// const configAndProps = $derived({
	// 	...fromStore(useContext(MotionConfigContext)).current,
	// 	...props,
	// 	layoutId: useLayoutId(props),
	// });

	// const { isStatic } = $derived(configAndProps);

	// const context = $derived(useCreateMotionContext<Instance>(props));

	// const visualState = $derived(useVisualState(props, isStatic));

	// $effect(() => {
	// 	if (!isStatic && isBrowser) {
	// 		useStrictMode(configAndProps, preloadedFeatures);

	// 		const layoutProjection = getProjectionFunctionality(configAndProps);
	// 		/**
	// 		 * If we need to measure the element we load this functionality in a
	// 		 * separate class component in order to gain access to getSnapshotBeforeUpdate.
	// 		 */
	// 		MeasureLayout = layoutProjection.MeasureLayout;

	// 		/**
	// 		 * Create a VisualElement for this component. A VisualElement provides a common
	// 		 * interface to renderer-specific APIs (ie DOM/Three.js etc) as well as
	// 		 * providing a way of rendering to these APIs outside of the React render loop
	// 		 * for more performant animations and interactions
	// 		 */
	// 		context.visualElement = useVisualElement<Instance, RenderState>(
	// 			Component,
	// 			visualState,
	// 			configAndProps,
	// 			createVisualElement,
	// 			layoutProjection.ProjectionNode
	// 		);

	// 		// MotionContext.Provider
	// 		MotionContext.Provider = context;
	// 	}

	// 	const measure =
	// 		MeasureLayout && context.visualElement
	// 			? MeasureLayout(anchor, {
	// 					visualElement: context.visualElement,
	// 					...configAndProps,
	// 				})
	// 			: null;

	// 	const renderer = useRender(anchor, {
	// 		Component,
	// 		props,
	// 		set ref(v: Instance) {
	// 			ref = v;
	// 			useMotionRef<Instance, RenderState>(visualState, context.visualElement, externalRef)(v);
	// 		},
	// 		get ref() {
	// 			return ref as Instance;
	// 		},
	// 		visualState,
	// 		isStatic,
	// 		visualElement: context.visualElement,
	// 		children,
	// 	});

	// 	return () => {
	// 		// Since useMotionRef is not called on destroy, the visual element is unmounted here
	// 		context.visualElement?.unmount();

	// 		if (measure) unmount(measure);
	// 		unmount(renderer);
	// 	};
	// });

	// $effect(() => {
	// measure =
	// 	MeasureLayout && context.visualElement
	// 		? mount(MeasureLayout, {
	// 				anchor,
	// 				props: { visualElement: context.visualElement, ...configAndProps },
	// 			})
	// 		: null;

	// renderer = mount(useRender, {
	// 	anchor,
	// 	props: {
	// 		Component,
	// 		props,
	// 		ref: useMotionRef<Instance, RenderState>(visualState, context.visualElement, externalRef),
	// 		visualState,
	// 		isStatic,
	// 		visualElement: context.visualElement,
	// 		children,
	// 		el: ref,
	// 	},
	// });

	// });

	// console.log(props);
	// console.log(configAndProps);

	// $effect(() => {
	// 	measure =
	// 		MeasureLayout && context.visualElement
	// 			? MeasureLayout(anchor, { visualElement: context.visualElement, ...configAndProps })
	// 			: null;
	// 	renderer = useRender(anchor, {
	// 		Component,
	// 		props,
	// 		ref: useMotionRef<Instance, RenderState>(visualState, context.visualElement, externalRef),
	// 		visualState,
	// 		isStatic,
	// 		visualElement: context.visualElement,
	// 		children: props.children,
	// 		el: ref,
	// 	});

	// 	return () => {
	// 		if (measure) unmount(measure);
	// 		unmount(renderer);
	// 	};
	// });

	// $effect(() => () => {
	// 	// Since useMotionRef is not called on destroy, the visual element is unmounted here
	// 	context.visualElement?.unmount();
	// });

	// $effect(() => {
	// 	measure =
	// 		MeasureLayout && context.visualElement
	// 			? mount(MeasureLayout, {
	// 					target: anchor,
	// 					props: { visualElement: context.visualElement, ...configAndProps },
	// 				})
	// 			: null;
	// 	renderer = mount(useRender, {
	// 		target: anchor,
	// 		props: {
	// 			Component,
	// 			props,
	// 			ref: useMotionRef<Instance, RenderState>(visualState, context.visualElement, externalRef),
	// 			visualState,
	// 			isStatic,
	// 			visualElement: context.visualElement,
	// 			children: props.children,
	// 			el: ref,
	// 		},
	// 	});

	// 	// flushSync();

	// 	return () => {
	// 		if (measure) unmount(measure);
	// 		unmount(renderer);
	// 	};
	// });

	// style="display: contents"
	// const children = createRawSnippet(() => {
	// 	return {
	// 		render: () => '<slot></slot>',
	// 		setup(target: Element) {
	// 			$effect.pre(() => {
	// 				const measure =
	// 					MeasureLayout && context.visualElement
	// 						? hydrate(MeasureLayout, {
	// 								target,
	// 								props: { visualElement: context.visualElement, ...configAndProps },
	// 							})
	// 						: null;
	// 				const renderer = hydrate(useRender, {
	// 					target,
	// 					props: {
	// 						Component,
	// 						props,
	// 						ref: useMotionRef<Instance, RenderState>(visualState, context.visualElement, externalRef),
	// 						visualState,
	// 						isStatic,
	// 						visualElement: context.visualElement,
	// 						children: props.children,
	// 						el: ref,
	// 					},
	// 				});

	// 				flushSync();

	// 				return () => {
	// 					if (measure) unmount(measure);
	// 					unmount(renderer);
	// 				};
	// 			});
	// 		},
	// 	};
	// });

	// return Motion(anchor, {
	// 	children,
	// });
	// };

	(Motion as any)[motionComponentSymbol] = Component;
	return Motion;
};

function useLayoutId({ layoutId }: MotionProps) {
	const layoutGroupId = get(useContext(LayoutGroupContext)).id;
	return layoutGroupId && layoutId !== undefined ? layoutGroupId + '-' + layoutId : layoutId;
}

function useStrictMode(configAndProps: MotionProps, preloadedFeatures?: FeatureBundle) {
	const isStrict = get(useContext(LazyContext)).strict;

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
