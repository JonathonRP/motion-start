/**
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 */

import type { EasingModifier } from '../types';

/**
 * Creates a mirrored easing function that applies the easing in both directions.
 *
 * Mathematical explanation:
 * Given an easing function f(t), mirrorEasing creates a new function g(t) where:
 *
 * For t ≤ 0.5 (first half):
 *   g(t) = f(2t) / 2
 *   - Doubles the progress to compress first half into full easing
 *   - Divides result by 2 to fit in first half of range
 *
 * For t > 0.5 (second half):
 *   g(t) = (2 - f(2(1-t))) / 2
 *   - Mirrors the easing by reversing and flipping
 *   - Creates symmetrical second half
 *
 * Visual description:
 * Converts a one-directional easing into a bidirectional ease-in-out.
 * - First half: Applies the easing function from 0 to 0.5
 * - Second half: Mirrors the easing function from 0.5 to 1
 *
 * The result is symmetrical around the midpoint (t=0.5), creating smooth
 * acceleration in the first half and matching deceleration in the second half.
 * Perfect for creating in-out versions of any easing curve.
 *
 * Dependencies: None (pure transformation)
 *
 * @param easing - The easing function to mirror
 * @returns A new bidirectional easing function
 *
 * @example
 * ```ts
 * // Create ease-in-out from ease-in
 * const easeIn = (t) => t * t;
 * const easeInOut = mirrorEasing(easeIn);
 *
 * easeInOut(0) // 0 (slow start)
 * easeInOut(0.25) // 0.125 (accelerating)
 * easeInOut(0.5) // 0.5 (peak speed)
 * easeInOut(0.75) // 0.875 (decelerating)
 * easeInOut(1) // 1 (slow end)
 *
 * // Symmetrical property
 * easeInOut(0.3) === 1 - easeInOut(0.7) // approximately true
 * ```
 */
export const mirrorEasing: EasingModifier = (easing) => (p) =>
	p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
