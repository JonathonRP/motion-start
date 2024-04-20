/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { AnimationControls } from "../types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

const isAnimationControls = (v?: any): v is AnimationControls => {
    return typeof v === "object" && typeof (v)?.start === "function"
};

export { isAnimationControls };
