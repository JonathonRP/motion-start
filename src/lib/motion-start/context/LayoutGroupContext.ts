/**
 * LayoutGroup Context (Legacy compatibility layer)
 * This file provides backwards compatibility while using the new context system
 *
 * based on framer-motion@4.1.17,
 * Copyright (c) 2018 Framer B.V.
 */

import {
    layoutGroupContext,
    useLayoutGroup,
} from './layout-group-context.svelte.js';
import { getDomContext } from "./DOMcontext";

// Re-export new context API
export {
    layoutGroupContext,
    useLayoutGroup,
} from './layout-group-context.svelte.js';

// Re-export context as LAYOUT_GROUP_CONTEXT_KEY for backwards compatibility
export { layoutGroupContext as LAYOUT_GROUP_CONTEXT_KEY };

/**
 * Legacy function - use layoutGroupContext.get() or useLayoutGroup() instead
 * @deprecated
 * @internal
 */
export const LayoutGroupContext = (c?: any): string | null => {
    const domContext = getDomContext("LayoutGroup", c);
    return (domContext || null) as string | null;
};
