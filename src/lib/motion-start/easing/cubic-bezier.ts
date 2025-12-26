/**
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Cubic bezier implementation adapted from Gaëtan Renaudeau's BezierEasing
 * https://github.com/gre/bezier-easing/blob/master/src/index.js
 */

import { noop } from './utils/noop';
import type { EasingFunction } from './types';

/**
 * Calculates the bezier curve value at time t for a given axis.
 * Uses the cubic bezier formula: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
 * Where P₀ = 0 and P₃ = 1 (normalized)
 *
 * @param t - Time parameter (0-1)
 * @param a1 - First control point coordinate
 * @param a2 - Second control point coordinate
 * @returns The bezier curve value at time t
 */
const calcBezier = (t: number, a1: number, a2: number): number =>
	(((1.0 - 3.0 * a2 + 3.0 * a1) * t + (3.0 * a2 - 6.0 * a1)) * t + 3.0 * a1) * t;

/**
 * Precision threshold for binary subdivision algorithm.
 * Smaller values = more precision but slower computation.
 */
const subdivisionPrecision = 0.0000001;

/**
 * Maximum iterations for binary subdivision to prevent infinite loops.
 */
const subdivisionMaxIterations = 12;

/**
 * Uses binary search to find the t value that produces a given x coordinate.
 * This inverts the bezier function to solve for t given x.
 *
 * Mathematical approach:
 * Given x, find t such that calcBezier(t, mX1, mX2) ≈ x
 * Uses binary subdivision within bounds [lowerBound, upperBound]
 *
 * @param x - The x coordinate to find t for
 * @param lowerBound - Lower bound for t search
 * @param upperBound - Upper bound for t search
 * @param mX1 - First control point x coordinate
 * @param mX2 - Second control point x coordinate
 * @returns The t value that produces the given x coordinate
 */
function binarySubdivide(
	x: number,
	lowerBound: number,
	upperBound: number,
	mX1: number,
	mX2: number
): number {
	let currentX: number;
	let currentT: number;
	let i: number = 0;

	do {
		currentT = lowerBound + (upperBound - lowerBound) / 2.0;
		currentX = calcBezier(currentT, mX1, mX2) - x;
		if (currentX > 0.0) {
			upperBound = currentT;
		} else {
			lowerBound = currentT;
		}
	} while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);

	return currentT;
}

/**
 * Creates a cubic bezier easing function from four control points.
 *
 * Mathematical explanation:
 * A cubic bezier curve is defined by four points: P₀(0,0), P₁(mX1,mY1), P₂(mX2,mY2), P₃(1,1)
 * The curve interpolates between P₀ and P₃, with P₁ and P₂ controlling the shape.
 *
 * Visual description:
 * The bezier curve creates smooth, controllable acceleration/deceleration.
 * - mX1, mY1: Controls the start of the curve (early acceleration)
 * - mX2, mY2: Controls the end of the curve (late deceleration)
 *
 * Special case: If mX1 === mY1 && mX2 === mY2, the curve is linear (no easing)
 *
 * @param mX1 - First control point x coordinate (typically 0-1)
 * @param mY1 - First control point y coordinate (can exceed 0-1 for overshoot)
 * @param mX2 - Second control point x coordinate (typically 0-1)
 * @param mY2 - Second control point y coordinate (can exceed 0-1 for overshoot)
 * @returns An easing function that applies the cubic bezier curve
 *
 * @example
 * ```ts
 * // Ease in: slow start, fast end
 * const easeIn = cubicBezier(0.42, 0, 1, 1);
 *
 * // Ease out: fast start, slow end
 * const easeOut = cubicBezier(0, 0, 0.58, 1);
 *
 * // Ease in-out: slow start and end, fast middle
 * const easeInOut = cubicBezier(0.42, 0, 0.58, 1);
 *
 * // Custom with overshoot
 * const customBounce = cubicBezier(0.68, -0.55, 0.265, 1.55);
 * ```
 */
export function cubicBezier(
	mX1: number,
	mY1: number,
	mX2: number,
	mY2: number
): EasingFunction {
	// If control points form a linear curve, return identity function
	if (mX1 === mY1 && mX2 === mY2) return noop;

	// Create function to get t value for a given x
	const getTForX = (aX: number) => binarySubdivide(aX, 0, 1, mX1, mX2);

	// Return the easing function
	return (t: number) => (t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2));
}
