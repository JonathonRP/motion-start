/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';

/**
 * Layout group context created with Svelte 5's createContext
 * @internal
 */
const [getLayoutGroupContext, setLayoutGroupContext] = createContext<string | null>();

/**
 * Layout group context - provides layout group ID for shared layout animations
 * @public
 */
export const LayoutGroupContext = {
	/**
	 * Set layout group context value and return it
	 */
	set(value: string | null): string | null {
		return setLayoutGroupContext(value);
	},

	/**
	 * Get layout group context value (returns null if not in context)
	 */
	get(): string | null {
		try {
			return getLayoutGroupContext();
		} catch {
			return null;
		}
	},
};

/**
 * Context key for backwards compatibility
 * @public
 */
export const LAYOUT_GROUP_CONTEXT_KEY = LayoutGroupContext;
