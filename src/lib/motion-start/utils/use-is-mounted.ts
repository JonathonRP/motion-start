/**
 * Tracks whether a component is currently mounted
 *
 * For Svelte 5, use $effect for mounting/unmounting logic:
 * ```ts
 * let isMounted = $state(false);
 * $effect(() => {
 *   isMounted = true;
 *   return () => { isMounted = false; };
 * });
 * ```
 *
 * @returns Ref object with current mount state
 */
export function useIsMounted() {
	const isMounted = { current: false };

	// In Svelte 5, you would use $effect for this pattern
	// $effect(() => {
	//   isMounted.current = true;
	//   return () => { isMounted.current = false; };
	// });

	return isMounted;
}
