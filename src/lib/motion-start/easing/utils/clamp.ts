/**
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 */

/**
 * Clamps a value between a minimum and maximum boundary.
 *
 * Mathematical behavior:
 * - If v > max, returns max
 * - If v < min, returns min
 * - Otherwise returns v
 *
 * Visual description: Constrains values to stay within defined bounds,
 * preventing overflow or underflow in easing calculations.
 *
 * @param min - The minimum boundary value
 * @param max - The maximum boundary value
 * @param v - The value to clamp
 * @returns The clamped value within [min, max]
 *
 * @example
 * ```ts
 * clamp(0, 1, 1.5) // Returns 1
 * clamp(0, 1, -0.5) // Returns 0
 * clamp(0, 1, 0.5) // Returns 0.5
 * ```
 */
export const clamp = (min: number, max: number, v: number): number => {
	if (v > max) return max;
	if (v < min) return min;
	return v;
};
