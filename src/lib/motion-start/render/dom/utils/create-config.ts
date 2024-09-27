
/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionComponentConfig } from "../../../motion";
import type { FeatureComponents } from "../../../motion/features/types";
import type { HTMLRenderState } from "../../html/types";
import type { SVGRenderState } from "../../svg/types";
import type { CreateVisualElement } from "../../types";
import type { CustomMotionComponentConfig } from "../motion-proxy";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { __assign } from 'tslib';
import { htmlMotionConfig } from '../../html/config-motion.js';
import { svgMotionConfig } from '../../svg/config-motion.js';
import { createUseRender } from '../use-render.js'; //wierd
import { isSVGComponent } from './is-svg-component.js';

function createDomMotionConfig(Component: string | React.ComponentType, { forwardMotionProps }: CustomMotionComponentConfig, preloadedFeatures?: FeatureComponents, createVisualElement?: CreateVisualElement<any>) {
    var baseConfig = isSVGComponent(Component)
        ? svgMotionConfig
        : htmlMotionConfig;
    return __assign(__assign({}, baseConfig), { preloadedFeatures: preloadedFeatures, useRender: createUseRender(forwardMotionProps), createVisualElement: createVisualElement,
        Component: Component }) as MotionComponentConfig<SVGElement, SVGRenderState> | MotionComponentConfig<HTMLElement, HTMLRenderState>;
}

export { createDomMotionConfig };

