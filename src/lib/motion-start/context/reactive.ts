/**
 * Reactive context utilities for Svelte 5 runes.
 * 
 * In Svelte 5, reactive contexts are created using $state runes and
 * passed through setContext/getContext. This file provides patterns
 * and utilities for creating reactive contexts.
 * 
 * @example
 * ```typescript
 * // In a component (.svelte or .svelte.ts with runes)
 * function createMyContext() {
 *   let count = $state(0);
 *   return {
 *     get count() { return count; },
 *     increment: () => { count++; }
 *   };
 * }
 * 
 * // Provider
 * const myContext = createMyContext();
 * setContext('myKey', myContext);
 * 
 * // Consumer
 * const ctx = getContext('myKey');
 * $effect(() => {
 *   console.log(ctx.count); // Automatically reactive!
 * });
 * ```
 */

export interface ReactiveContextOptions {
	/**
	 * Enable debug logging for context changes
	 */
	debug?: boolean;
}

/**
 * Helper type for contexts with reactive state.
 * All properties marked with this type will be reactive when
 * accessed in components with $effect.
 */
export type ReactiveState<T> = T;
