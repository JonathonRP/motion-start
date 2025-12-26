/**
 * WAAPI Support Detection
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Detects whether the browser supports Web Animations API (WAAPI).
 */

/**
 * Check if WAAPI is supported in the current environment
 *
 * @returns true if WAAPI is supported
 */
export function supportsWaapi(): boolean {
	// SSR check
	if (typeof window === 'undefined') {
		return false;
	}

	// Check for Element.animate support
	return typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
}

/**
 * Cached result of WAAPI support check
 */
let cachedSupportsWaapi: boolean | undefined;

/**
 * Get cached WAAPI support status
 *
 * @returns true if WAAPI is supported
 */
export function getSupportsWaapi(): boolean {
	if (cachedSupportsWaapi === undefined) {
		cachedSupportsWaapi = supportsWaapi();
	}
	return cachedSupportsWaapi;
}
