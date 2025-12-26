/**
 * Easing to String Conversion
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Converts easing definitions to CSS/WAAPI-compatible strings.
 */

import type { Easing } from '../../../../types.js';

/**
 * Convert easing array to cubic-bezier string
 *
 * @param easing - Cubic bezier values [x1, y1, x2, y2]
 * @returns CSS cubic-bezier string
 */
export function cubicBezierAsString(easing: number[]): string {
	return `cubic-bezier(${easing[0]}, ${easing[1]}, ${easing[2]}, ${easing[3]})`;
}

/**
 * Named easing presets that map to CSS easing keywords
 */
const namedEasings: Record<string, string> = {
	linear: 'linear',
	ease: 'ease',
	easeIn: 'ease-in',
	easeOut: 'ease-out',
	easeInOut: 'ease-in-out',
	circIn: 'cubic-bezier(0.6, 0.04, 0.98, 0.34)',
	circOut: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
	circInOut: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
	backIn: 'cubic-bezier(0.6, -0.28, 0.74, 0.05)',
	backOut: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
	backInOut: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
	anticipate: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

/**
 * Convert easing definition to WAAPI-compatible string
 *
 * @param easing - Easing definition (name, array, or function)
 * @returns CSS easing string, or undefined if not convertible
 */
export function easingToString(easing?: Easing): string | undefined {
	if (!easing) {
		return 'linear';
	}

	// If it's already a string, check if it's a named preset
	if (typeof easing === 'string') {
		return namedEasings[easing] || easing;
	}

	// If it's an array, assume cubic-bezier
	if (Array.isArray(easing)) {
		// Cubic bezier should have 4 values
		if (easing.length === 4) {
			return cubicBezierAsString(easing as number[]);
		}
	}

	// If it's a function, we can't convert it to WAAPI
	// The caller should handle this case
	return undefined;
}
