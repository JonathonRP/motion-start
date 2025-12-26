/**
 * Presence Context (Legacy compatibility layer)
 * This file provides backwards compatibility while using the new context system
 *
 * based on framer-motion@4.1.17,
 * Copyright (c) 2018 Framer B.V.
 */

import {
    presenceContext,
    usePresence,
    isPresent,
    type PresenceContextValue,
} from './presence-context.svelte.js';
import { getDomContext } from "./DOMcontext";

// Re-export new context API
export {
    presenceContext,
    usePresence,
    isPresent,
    type PresenceContextValue as PresenceContextProps,
} from './presence-context.svelte.js';

// Re-export context as PRESENCE_CONTEXT_KEY for backwards compatibility
export { presenceContext as PRESENCE_CONTEXT_KEY };

/**
 * Legacy function - use presenceContext.get() or usePresence() instead
 * @deprecated
 * @public
 */
export const PresenceContext = (c?: any): PresenceContextValue | null => {
    const domContext = getDomContext("Presence", c);
    return (domContext || null) as PresenceContextValue | null;
};
