/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { FeatureComponents } from "./types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

import { UsePanGesture } from '../../gestures/use-pan-gesture.js';
import { UseDrag } from '../../gestures/drag/use-drag.js';

/**
 * @public
 */
const drag = {
    pan: UsePanGesture,
    drag: UseDrag
} satisfies FeatureComponents

export { drag };
