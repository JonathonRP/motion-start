/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { FeatureComponents } from "../types";
export declare const layoutAnimations: FeatureComponents;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

import { AnimateLayoutContextProvider } from './Animate.js';
import { MeasureContextProvider } from './Measure.js';

var layoutAnimations = {
    measureLayout: MeasureContextProvider,
    layoutAnimation: AnimateLayoutContextProvider
};

export { layoutAnimations };
