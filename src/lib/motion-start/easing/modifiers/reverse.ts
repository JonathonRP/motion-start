/**
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 */

import type { EasingModifier } from '../types';

/**
 * Reverses an easing function, flipping it along both axes.
 *
 * Mathematical explanation:
 * Given an easing function f(t), reverseEasing creates a new function g(t) where:
 * g(t) = 1 - f(1 - t)
 *
 * This transformation:
 * 1. Flips the input: (1 - t) reverses the time direction
 * 2. Flips the output: 1 - f(...) inverts the result
 *
 * Visual description:
 * Converts an ease-in to an ease-out and vice versa.
 * - If the original easing accelerates, the reversed version decelerates
 * - If the original easing decelerates, the reversed version accelerates
 *
 * Think of it like playing an animation in reverse: what was speeding up
 * is now slowing down, and what was slowing down is now speeding up.
 *
 * Dependencies: None (pure transformation)
 *
 * @param easing - The easing function to reverse
 * @returns A new easing function with reversed behavior
 *
 * @example
 * ```ts
 * // Create ease-out from ease-in
 * const easeIn = (t) => t * t;
 * const easeOut = reverseEasing(easeIn);
 *
 * easeIn(0.5) // 0.25 (slow start)
 * easeOut(0.5) // 0.75 (fast start, slowing down)
 *
 * // They mirror each other
 * easeIn(0.3) + easeOut(0.7) === 1 // true
 * ```
 */
export const reverseEasing: EasingModifier = (easing) => (p) => 1 - easing(1 - p);
