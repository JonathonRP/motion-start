/**
 * Layout Group Context using Svelte 5 createContext
 * Manages shared layout animations within a group
 *
 * @module layout-group-context
 */

import { getContext, setContext } from 'svelte';

const LAYOUT_GROUP_CONTEXT_KEY = Symbol('layout-group-context');

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
	set(value: string | null): void {
		setContext(LAYOUT_GROUP_CONTEXT_KEY, value);
	},
	get(): string | null | undefined {
		return getContext<string | null>(LAYOUT_GROUP_CONTEXT_KEY);
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
