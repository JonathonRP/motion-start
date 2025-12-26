/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { FeatureComponents } from './types';

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { UseDrag } from '../../gestures/drag/use-drag.js';
import { UsePanGesture } from '../../gestures/use-pan-gesture.js';

/**
 * @public
 */
const drag: FeatureComponents = {
	pan: UsePanGesture,
	drag: UseDrag,
};

export { drag };
