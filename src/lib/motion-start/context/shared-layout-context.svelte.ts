/**
 * Shared Layout Context using Svelte 5 createContext
 * Based on framer-motion@11.11.11
 *
 * @module shared-layout-context
 */

import { createContext } from 'svelte';
import type { SharedLayoutSyncMethods, SyncLayoutBatcher } from '../components/AnimateSharedLayout/types.js';
import { createBatcher } from '../components/AnimateSharedLayout/utils/batcher.js';

/**
 * Shared layout context type
 */
export type SharedLayoutContextValue = SyncLayoutBatcher | SharedLayoutSyncMethods;

/**
 * Default shared layout batcher
 */
const DEFAULT_BATCHER: SyncLayoutBatcher = createBatcher();

/**
 * Shared layout context created with Svelte 5's createContext
 * Returns a tuple of [get, set] functions for type-safe context access
 * @internal
 */
const [getSharedLayoutContext, setSharedLayoutContext] = createContext<SharedLayoutContextValue>();

/**
 * Shared layout context - manages shared layout animations
 *
 * @example
 * ```svelte
 * <script>
 *   import { sharedLayoutContext } from 'motion-start/context';
 *
 *   const batcher = createBatcher();
 *   sharedLayoutContext.set(batcher);
 * </script>
 * ```
 *
 * @public
 */
export const sharedLayoutContext = {
	/**
	 * Set shared layout context value and return it
	 */
	set(value: SharedLayoutContextValue): SharedLayoutContextValue {
		setSharedLayoutContext(value);
		return value;
	},

	/**
	 * Get shared layout context value (returns default batcher if not in context)
	 */
	get(): SharedLayoutContextValue {
		try {
			return getSharedLayoutContext();
		} catch {
			return DEFAULT_BATCHER;
		}
	},
};

/**
 * Check if the context value is SharedLayoutSyncMethods
 * @internal
 */
export function isSharedLayout(context: SharedLayoutContextValue): context is SharedLayoutSyncMethods {
	return 'forceUpdate' in context;
}

/**
 * Get the current shared layout context
 *
 * @returns The shared layout context value
 * @public
 */
export function useSharedLayout(): SharedLayoutContextValue {
	return sharedLayoutContext.get();
}
