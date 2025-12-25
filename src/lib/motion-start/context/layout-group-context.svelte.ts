/**
 * Layout Group Context using Svelte 5 createContext
 * Manages shared layout animations within a group
 *
 * @module layout-group-context
 */

import { createContext } from 'svelte';

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
export const layoutGroupContext = createContext<string | null>('layout-group-context');

/**
 * Get the current layout group ID
 *
 * @returns The layout group ID or null if not in a layout group
 * @public
 */
export function useLayoutGroup(): string | null {
    return layoutGroupContext.get();
}
