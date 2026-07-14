/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { drag } from '../../motion/features/drag';
import { layout } from '../../motion/features/layout';
import type { FeatureBundle } from '../../motion/features/types';
import { domAnimation } from './features-animation';

/**
 * @public
 */
export const domMax: FeatureBundle = {
	...domAnimation,
	...drag,
	...layout,
};
