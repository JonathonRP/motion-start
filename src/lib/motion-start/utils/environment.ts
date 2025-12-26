/**
 * SvelteKit environment utilities
 * For SSR-safe operations and browser-only features
 */

/**
 * Check if code is running in browser environment
 * Safe for SvelteKit SSR
 */
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Check if code is running in server environment
 */
export const isServer = !isBrowser;

/**
 * Check if IntersectionObserver is available
 * Used by useInView
 */
export const hasIntersectionObserver = isBrowser && 'IntersectionObserver' in window;

/**
 * Check if ResizeObserver is available
 * Used by layout animations
 */
export const hasResizeObserver = isBrowser && 'ResizeObserver' in window;

/**
 * Check if requestAnimationFrame is available
 * Used by animation engine
 */
export const hasRequestAnimationFrame = isBrowser && 'requestAnimationFrame' in window;

/**
 * Check if touch events are supported
 */
export const hasTouchEvents = isBrowser && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

/**
 * Check if pointer events are supported
 */
export const hasPointerEvents = isBrowser && 'PointerEvent' in window;

/**
 * Run a function only in browser environment
 * Returns undefined on server
 *
 * @example
 * ```ts
 * const element = runInBrowser(() => document.querySelector('.my-element'));
 * ```
 */
export function runInBrowser<T>(fn: () => T): T | undefined {
	return isBrowser ? fn() : undefined;
}

/**
 * Get window dimensions safely
 * Returns { width: 0, height: 0 } on server
 */
export function getWindowDimensions() {
	if (!isBrowser) {
		return { width: 0, height: 0 };
	}

	return {
		width: window.innerWidth,
		height: window.innerHeight,
	};
}

/**
 * Get document dimensions safely
 * Returns { width: 0, height: 0 } on server
 */
export function getDocumentDimensions() {
	if (!isBrowser || !document.documentElement) {
		return { width: 0, height: 0 };
	}

	return {
		width: document.documentElement.scrollWidth,
		height: document.documentElement.scrollHeight,
	};
}

/**
 * Check if reduced motion is preferred
 * Returns false on server
 */
export function prefersReducedMotion(): boolean {
	if (!isBrowser || !window.matchMedia) {
		return false;
	}

	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
