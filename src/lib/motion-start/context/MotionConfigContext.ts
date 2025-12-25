/**
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Transition } from "../types";
import type { TransformPoint2D } from "../types/geometry";

/**
 * @public
 */
export interface MotionConfigContextObject {
    /**
     * @internal
     */
    transformPagePoint: TransformPoint2D;
    /**
     * Determines whether this is a static context ie the Framer canvas. If so,
     * it'll disable all dynamic functionality.
     *
     * @internal
     */
    isStatic: boolean;
    /**
     * Defines a new default transition for the entire tree.
     *
     * @public
     */
    transition?: Transition;
}

import { getDomContext } from "./DOMcontext";

/**
 * Context key for MotionConfig
 * @public
 */
export const MOTION_CONFIG_CONTEXT_KEY = Symbol('MotionConfigContext');

/**
 * @public
 */
var MotionConfigContext = (c?: any): MotionConfigContextObject => {
    const domContext = getDomContext("MotionConfig", c);
    return (domContext || {
        transformPagePoint: function (p) { return p; },
        isStatic: false,
    }) as MotionConfigContextObject;
};

export { MotionConfigContext };
