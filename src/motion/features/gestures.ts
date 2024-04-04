/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { FeatureComponents } from "./types";
export declare const gestureAnimations: FeatureComponents;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

import { UseFocusGesture } from '../../gestures/use-focus-gesture.js';
import { UseHoverGesture } from '../../gestures/use-hover-gesture.js';
import { UseTapGesture } from '../../gestures/use-tap-gesture.js';
/**
 * @public
 */
const gestureAnimations = {
    tap: UseTapGesture,
    focus: UseFocusGesture,
    hover: UseHoverGesture,
};

export { gestureAnimations };