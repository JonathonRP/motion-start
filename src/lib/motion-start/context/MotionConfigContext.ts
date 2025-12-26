/**
 * MotionConfig Context (Legacy compatibility layer)
 * This file provides backwards compatibility while using the new context system
 *
 * based on framer-motion@4.1.17,
 * Copyright (c) 2018 Framer B.V.
 */

import {
    motionConfigContext,
    useMotionConfig,
    type MotionConfigContextValue,
} from './motion-config-context.svelte.js';
import { getDomContext } from "./DOMcontext";

// Re-export new context API
export {
    motionConfigContext,
    useMotionConfig,
    type MotionConfigContextValue as MotionConfigContextObject,
    type TransformPoint2D,
} from './motion-config-context.svelte.js';

// Re-export context as MOTION_CONFIG_CONTEXT_KEY for backwards compatibility
export { motionConfigContext as MOTION_CONFIG_CONTEXT_KEY };

/**
 * Legacy function - use motionConfigContext.get() or useMotionConfig() instead
 * @deprecated
 * @public
 */
export const MotionConfigContext = (c?: any): MotionConfigContextValue => {
    const domContext = getDomContext("MotionConfig", c);
    return (domContext || {
        transformPagePoint: function (p) { return p; },
        isStatic: false,
    }) as MotionConfigContextValue;
};
