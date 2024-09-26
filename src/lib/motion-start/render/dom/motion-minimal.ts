/// <reference types="react" />
/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { layoutAnimations } from '../../motion/features/layout/index.js';
//import { createMotionProxy } from './motion-proxy.js';
import { createMotionClass } from './create-motion-class.js';

/**
 * @public
 */
var m = /*@__PURE__*/ //createMotionProxy([MeasureLayout]);
    createMotionClass({ ...layoutAnimations }) as unknown as (<Props>(Component: string | import("react").ComponentType<Props>, customMotionComponentConfig?: import("./motion-proxy.js").CustomMotionComponentConfig) => import("./motion-proxy.js").CustomDomComponent<Props>) & import("../html/types.js").HTMLMotionComponents & import("../svg/types.js").SVGMotionComponents

export { m as M };
