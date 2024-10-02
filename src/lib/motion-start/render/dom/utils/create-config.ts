/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionComponentConfig } from '../../../motion';
import type { FeatureComponents } from '../../../motion/features/types';
import type { HTMLRenderState } from '../../html/types';
import type { SVGRenderState } from '../../svg/types';
import type { CreateVisualElement } from '../../types';
import type { CustomMotionComponentConfig } from '../motion-proxy';
import type { Component } from 'svelte';

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { htmlMotionConfig } from '../../html/config-motion.js';
import { svgMotionConfig } from '../../svg/config-motion.js';
import { createUseRender } from '../use-render.js';
import { isSVGComponent } from './is-svg-component.js';

function createDomMotionConfig(
	Component: string | Component,
	{ forwardMotionProps }: CustomMotionComponentConfig,
	preloadedFeatures?: FeatureComponents,
	createVisualElement?: CreateVisualElement<any>
) {
	var baseConfig = isSVGComponent(Component) ? svgMotionConfig : htmlMotionConfig;

	return Object.assign(Object.assign({}, baseConfig), {
		preloadedFeatures,
		useRender: createUseRender(forwardMotionProps),
		createVisualElement,
		Component,
	}) as any satisfies
		| MotionComponentConfig<SVGElement, SVGRenderState>
		| MotionComponentConfig<HTMLElement, HTMLRenderState>;
}

export { createDomMotionConfig };
