/**
 * Motion Context (Legacy compatibility layer)
 * This file provides backwards compatibility while using the new context system
 *
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import type { VisualElement } from "../../render/types";
import {
    motionContext,
    useMotionContext,
    useVisualElement,
    type MotionContextValue,
} from '../motion-context.svelte.js';
import { getDomContext } from "../DOMcontext";

// Re-export new context API
export {
    motionContext,
    useMotionContext,
    useVisualElement,
    type MotionContextValue as MotionContextProps,
} from '../motion-context.svelte.js';

// Re-export context as MOTION_CONTEXT_KEY for backwards compatibility
export { motionContext as MOTION_CONTEXT_KEY };

/**
 * Legacy function - use motionContext.get() or useMotionContext() instead
 * @deprecated
 */
export const MotionContext = (c?: any): MotionContextValue => {
    const domContext = getDomContext("Motion", c);
    return (domContext || {}) as MotionContextValue;
};

/**
 * Legacy function - use useVisualElement() instead
 * @deprecated
 */
export const useVisualElementContext = (c?: any) => {
    // Try new context first, fall back to old getDomContext
    const newContext = useMotionContext();
    if (newContext.visualElement) {
        return newContext.visualElement;
    }
    const domContext = getDomContext("Motion", c);
    return (domContext?.visualElement as VisualElement<any, any>) || undefined;
};

export { default as UseVisualElementContext } from "./MotionContext.svelte";

