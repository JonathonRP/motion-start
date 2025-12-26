/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
Adapted for Svelte 5
*/

import { rootProjectionNode } from './node/HTMLProjectionNode.js';

/**
 * Use instant layout transition hook for Svelte 5
 *
 * This hook provides a way to perform instant layout transitions without animation.
 * It temporarily blocks updates on the projection tree while executing a callback.
 *
 * @returns A function that takes a callback and executes it during an instant transition
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useInstantLayoutTransition } from '$lib/motion-start/projection';
 *
 *   const startTransition = useInstantLayoutTransition();
 *
 *   function handleClick() {
 *     startTransition(() => {
 *       // Perform instant layout changes here
 *       // These will not trigger layout animations
 *     });
 *   }
 * </script>
 * ```
 */
export function useInstantLayoutTransition() {
	return startTransition;
}

function startTransition(callback?: () => void) {
	const root = rootProjectionNode.current;

	if (root) {
		// Block updates on the entire tree to prevent animations
		if (root.blockUpdate) {
			root.blockUpdate();
		}
	}

	// Execute the callback if provided
	callback?.();
}
