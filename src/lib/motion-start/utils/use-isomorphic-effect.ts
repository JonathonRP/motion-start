import { isBrowser } from './is-browser.js';

/**
 * Svelte 5 effect wrapper that's safe for SSR
 *
 * In Svelte 5, $effect is always isomorphic and safe to use.
 * This utility exists for API compatibility but in practice,
 * you should use $effect directly in Svelte 5 components.
 *
 * Example usage:
 * ```ts
 * $effect(() => {
 *   // Your effect code here
 *   // This runs on mount and when dependencies change
 *   return () => {
 *     // Cleanup code
 *   };
 * });
 * ```
 */
export const useIsomorphicEffect = isBrowser;
