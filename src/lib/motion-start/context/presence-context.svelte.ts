/**
 * Presence Context using Svelte 5 createContext
 * Manages AnimatePresence state for enter/exit animations
 *
 * @module presence-context
 */

import { createContext } from 'svelte';
import type { VariantLabels } from '../motion/types.js';

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
 * Presence context created with Svelte 5's createContext
 * Returns a tuple of [get, set] functions for type-safe context access
 * @internal
 */
const [getPresenceContext, setPresenceContext] = createContext<PresenceContextValue | null>();

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
	/**
	 * Set presence context value and return it
	 */
	set(value: PresenceContextValue | null): PresenceContextValue | null {
		setPresenceContext(value);
		return value;
	},

	/**
	 * Get presence context value (returns null if not in context)
	 */
	get(): PresenceContextValue | null {
		try {
			return getPresenceContext();
		} catch {
			return null;
		}
	},
};

/**
 * Get the current presence state
 *
 * @returns The presence context value or null if not in AnimatePresence
 * @public
 */
export function usePresence(): PresenceContextValue | null {
	return presenceContext.get();
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
