/**
 * Linear Easing Support Detection
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Detects whether the browser supports linear easing syntax in WAAPI.
 * The linear() easing function allows for custom easing curves.
 */

/**
 * Check if linear easing is supported
 *
 * Tries to create an animation with linear() easing syntax.
 * If it fails, the browser doesn't support it.
 */
export function supportsLinearEasing(): boolean {
	// SSR check
	if (typeof window === 'undefined') {
		return false;
	}

	// Check for Element.animate support first
	if (typeof Element === 'undefined' || typeof Element.prototype.animate !== 'function') {
		return false;
	}

	try {
		// Try to create a dummy element and animate with linear() easing
		const testElement = document.createElement('div');
		const animation = testElement.animate(
			{ opacity: [0, 1] },
			{
				duration: 100,
				easing: 'linear(0, 1)',
			}
		);

		// If we get here, linear easing is supported
		animation.cancel();
		return true;
	} catch (e) {
		// Failed to create animation with linear() easing
		return false;
	}
}

/**
 * Cached result of linear easing support check
 */
let cachedSupportsLinearEasing: boolean | undefined;

/**
 * Get cached linear easing support status
 *
 * @returns true if linear() easing is supported
 */
export function getSupportsLinearEasing(): boolean {
	if (cachedSupportsLinearEasing === undefined) {
		cachedSupportsLinearEasing = supportsLinearEasing();
	}
	return cachedSupportsLinearEasing;
}
