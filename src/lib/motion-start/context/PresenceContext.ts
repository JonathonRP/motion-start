/**
 * @deprecated Use presence-context.svelte.ts instead
 * This file re-exports from the new Svelte 5 implementation for backwards compatibility
 *
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import {
	presenceContext,
	type PresenceContextValue,
	usePresence as usePresenceHook,
	isPresent as isPresentFn,
} from './presence-context.svelte.js';

/**
 * Presence context interface
 * @deprecated Use PresenceContextValue from presence-context.svelte.ts
 * @public
 */
export interface PresenceContext extends PresenceContextValue {}

/**
 * Type alias for backwards compatibility
 * @public
 */
export type { PresenceContext as PresenceContextProps };

/**
 * Presence context - manages AnimatePresence state
 * @deprecated Use presenceContext from presence-context.svelte.ts
 * @public
 */
export const PresenceContext = presenceContext;

/**
 * Context key for backwards compatibility
 * @public
 */
export const PRESENCE_CONTEXT_KEY = PresenceContext;

/**
 * Hook to get presence state
 * @public
 */
export { usePresenceHook as usePresence, isPresentFn as isPresent };
