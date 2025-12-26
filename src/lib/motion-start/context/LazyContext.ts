/**
 * Lazy Context (Legacy compatibility layer)
 * This file provides backwards compatibility while using the new context system
 *
 * based on framer-motion@4.1.17,
 * Copyright (c) 2018 Framer B.V.
 */

import {
    lazyContext,
    useLazyContext,
    type LazyContextValue,
} from './lazy-context.svelte.js';
import { getDomContext } from './DOMcontext';

// Re-export new context API
export {
    lazyContext,
    useLazyContext,
    type LazyContextValue as LazyContextProps,
} from './lazy-context.svelte.js';

// Re-export context as LAZY_CONTEXT_KEY for backwards compatibility
export { lazyContext as LAZY_CONTEXT_KEY };

/**
 * Legacy function - use lazyContext.get() or useLazyContext() instead
 * @deprecated
 * @internal
 */
export const LazyContext = (c?: any): LazyContextValue => {
    const domContext = getDomContext('Lazy', c);
    return (domContext || { strict: false }) as LazyContextValue;
};
