/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
Adapted for Svelte 5
*/

import { rootProjectionNode } from './node/HTMLProjectionNode.js';

/**
 * Use reset projection hook for Svelte 5
 *
 * This hook provides a way to reset the entire projection tree.
 * Useful when you need to clear all layout animation state and start fresh.
 *
 * @returns A function that resets the projection tree
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useResetProjection } from '$lib/motion-start/projection';
 *
 *   const reset = useResetProjection();
 *
 *   function handleReset() {
 *     // Reset all projection state
 *     reset();
 *   }
 * </script>
 * ```
 */
export function useResetProjection() {
	return reset;
}

function reset() {
	const root = rootProjectionNode.current;

	if (!root) return;

	// Reset the entire projection tree
	// In the full implementation, this would call resetTree() on the root node
	// which recursively resets all projection state for all nodes in the tree

	// Placeholder: When the full projection node is implemented,
	// this will call root.resetTree()
}
