/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { FeatureComponents } from '../types';

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { AnimateLayoutContextProvider } from './Animate.js';
import { MeasureContextProvider } from './Measure.js';


var layoutAnimations: FeatureComponents = {
	measureLayout: MeasureContextProvider,
	layoutAnimation: AnimateLayoutContextProvider,
};

export { layoutAnimations };
