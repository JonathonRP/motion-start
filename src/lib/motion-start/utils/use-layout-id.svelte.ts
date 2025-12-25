/**
 * Layout ID hook
 * Computes a layout ID based on the layout group context
 *
 * Based on framer-motion@11.11.11
 * @module use-layout-id
 */

import { useLayoutGroup } from '../context/layout-group-context.svelte.js';

/**
 * Get the computed layout ID for the current element
 *
 * If the element is within a LayoutGroup, the layout ID will be prefixed
 * with the group ID to ensure uniqueness across groups.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useLayoutId } from 'motion-start/utils';
 *
 *   let props = $props();
 *   const layoutId = useLayoutId(() => props.layoutId);
 * </script>
 * ```
 *
 * @param layoutId - The base layout ID (can be a getter function for reactivity)
 * @returns The computed layout ID
 * @public
 */
export function useLayoutId(layoutId: string | undefined | (() => string | undefined)): string | undefined {
    const layoutGroupId = useLayoutGroup();

    const id = $derived(
        typeof layoutId === 'function' ? layoutId() : layoutId
    );

    return $derived(
        layoutGroupId && id !== undefined
            ? `${layoutGroupId}-${id}`
            : id
    );
}
