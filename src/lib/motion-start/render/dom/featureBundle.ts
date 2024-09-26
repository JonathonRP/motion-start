/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
// import type { FeatureBundle } from "../../motion/features/types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { animations } from "../../motion/features/animations";
import { drag } from "../../motion/features/drag";
import { gestureAnimations } from "../../motion/features/gestures";
import { layoutAnimations } from "../../motion/features/layout";

export const featureBundle = {
    ...animations,
    ...gestureAnimations,
    ...drag,
    ...layoutAnimations,
}
