/**
 * Presence Context using Svelte 5 createContext
 * Manages AnimatePresence state for enter/exit animations
 *
 * @module presence-context
 */

import { getContext, setContext } from 'svelte';
import type { VariantLabels } from '../motion/types.js';

const PRESENCE_CONTEXT_KEY = Symbol('presence-context');

/**
 * Presence context properties
 * @public
 */
export interface PresenceContextValue {
    /** Unique ID for this presence context */
    id: number;
    /** Whether this element should be present in the DOM */
    isPresent: boolean;
    /** Register a child element for presence tracking */
    register: (id: number) => () => void;
    /** Callback when all exit animations complete */
    onExitComplete?: (id: number) => void;
    /** Initial animation state */
    initial?: false | VariantLabels;
    /** Custom data to pass to animations */
    custom?: any;
}

/**
 * Presence context - manages AnimatePresence state
 *
 * @example
 * ```svelte
 * <script>
 *   import { presenceContext } from 'motion-start/context';
 *
 *   const presence = presenceContext.get();
 *   if (presence?.isPresent) {
 *     // Element should be visible
 *   }
 * </script>
 * ```
 *
 * @public
 */
export const presenceContext = {
	set(value: PresenceContextValue | null): void {
		setContext(PRESENCE_CONTEXT_KEY, value);
	},
	get(): PresenceContextValue | null | undefined {
		return getContext<PresenceContextValue | null>(PRESENCE_CONTEXT_KEY);
	},
};

/**
 * Get the current presence state
 *
 * @returns The presence context value or null if not in AnimatePresence
 * @public
 */
export function usePresence(): PresenceContextValue | null {
    return presenceContext.get() ?? null;
}

/**
 * Check if the current element is present
 *
 * @returns true if present, false otherwise
 * @public
 */
export function isPresent(): boolean {
    const presence = presenceContext.get();
    return presence?.isPresent ?? true;
}
