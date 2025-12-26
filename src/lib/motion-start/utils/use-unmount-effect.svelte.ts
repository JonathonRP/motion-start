/**
 * Unmount effect hook
 * Runs a callback when the component unmounts
 *
 * Based on framer-motion@11.11.11
 * @module use-unmount-effect
 */

/**
 * Run a callback when the component unmounts
 *
 * @example
 * ```svelte
 * <script>
 *   import { useUnmountEffect } from 'motion-start/utils';
 *
 *   useUnmountEffect(() => {
 *     console.log('Component unmounting');
 *     // Cleanup logic here
 *   });
 * </script>
 * ```
 *
 * @param callback - Function to run on unmount
 * @public
 */
export function useUnmountEffect(callback: () => void): void {
	$effect(() => {
		return () => callback();
	});
}
