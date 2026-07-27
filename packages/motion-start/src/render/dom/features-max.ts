/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { drag } from '../../motion/features/drag.js';
import { layout } from '../../motion/features/layout.js';
import type { FeatureBundle } from '../../motion/features/types.js';
import { domAnimation } from './features-animation.js';

/**
 * @public
 */
export const domMax: FeatureBundle = {
	...domAnimation,
	...drag,
	...layout,
};
