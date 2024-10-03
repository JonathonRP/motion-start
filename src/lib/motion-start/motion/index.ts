/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { CreateVisualElement } from '../render/types';
import type { FeatureBundle, RenderComponent } from './features/types';
import type { UseVisualState } from './utils/use-visual-state';
export type { MotionProps } from './types';

export interface MotionComponentConfig<Instance, RenderState> {
	preloadedFeatures?: FeatureBundle;
	createVisualElement?: CreateVisualElement<Instance>;
	useRender: RenderComponent<Instance, RenderState>;
	useVisualState: UseVisualState<Instance, RenderState>;
	Component: string | Component;
}

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import Motion from './Motion.svelte';
import { loadFeatures } from './features/definitions';
import type { MotionProps } from './types';
import type { Component } from 'svelte';

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
export const createMotionComponent = <Props extends {}, Instance, RenderState>({
	preloadedFeatures,
	createVisualElement,
	useRender: forwardMotionProps,
	useVisualState: visualStateConfig,
	Component,
}: MotionComponentConfig<Instance, RenderState>): Component<Props & MotionProps> => {
	preloadedFeatures && loadFeatures(preloadedFeatures);
	// @ts-expect-error
	return class MotionComponent extends Motion {
		constructor(options:any) {
			const props = options.props;
			options.props = {
				props,
				defaultFeatures: preloadedFeatures,
				createVisualElement,
				forwardMotionProps,
				Component,
				visualStateConfig,
			};
			super({ component: Motion, ...options });
		}// @ts-expect-error
	} satisfies Component<Props & MotionProps>;
};
