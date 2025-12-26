/**
 * Safe Svelte types that mirror common reference patterns
 * Allows code to work without directly depending on Svelte internals
 *
 * These types are adapted from React's ref types to provide similar
 * functionality in a framework-agnostic way
 */

/**
 * A mutable reference object
 */
export interface MutableRefObject<T> {
	current: T;
}

/**
 * A reference object that can be null
 */
export interface RefObject<T> {
	current: T | null;
}
