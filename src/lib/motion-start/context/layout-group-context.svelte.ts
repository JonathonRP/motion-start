/**
 * Layout Group Context using Svelte 5 createContext
 * Manages shared layout animations within a group
 *
 * @module layout-group-context
 */

import { createContext } from 'svelte';

/**
 * Layout group context created with Svelte 5's createContext
 * Returns a tuple of [get, set] functions for type-safe context access
 * @internal
 */
const [getLayoutGroupContext, setLayoutGroupContext] = createContext<string | null>();

/**
 * Layout group context - provides a group ID for shared layout animations
 *
 * @example
 * ```svelte
 * <script>
 *   import { layoutGroupContext } from 'motion-start/context';
 *
 *   layoutGroupContext.set('my-layout-group');
 * </script>
 * ```
 *
 * @public
 */
export const layoutGroupContext = {
	/**
	 * Set layout group context value
	 */
	set: setLayoutGroupContext,

	/**
	 * Get layout group context value (returns undefined if not in context)
	 */
	get(): string | null | undefined {
		try {
			return getLayoutGroupContext();
		} catch {
			return undefined;
		}
	},
};

/**
 * Get the current layout group ID
 *
 * @returns The layout group ID or null if not in a layout group
 * @public
 */
export function useLayoutGroup(): string | null {
    return layoutGroupContext.get() ?? null;
}
