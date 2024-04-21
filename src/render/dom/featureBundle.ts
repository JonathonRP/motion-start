/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { FeatureBundle } from "../../motion/features/types";
/**
 * @public
 */
export declare const domMax: FeatureBundle;

/**
 * @public
 */
export declare const domAnimation: FeatureBundle;

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { gestureAnimations } from "../../motion/features/gestures"
import { drag } from "../../motion/features/drag"
import { layoutAnimations } from "../../motion/features/layout";
import { animations } from "../../motion/features/animations";

export const featureBundle = {
    ...animations,
    ...gestureAnimations,
    ...drag,
    ...layoutAnimations,
}
