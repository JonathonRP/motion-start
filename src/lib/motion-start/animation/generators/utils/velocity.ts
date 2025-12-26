/**
 * Velocity Calculation Utilities
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Utilities for calculating velocity during generator animations.
 * Used by spring and inertia generators to determine animation state.
 */

import { velocityPerSecond } from '../../../utils/velocity-per-second.js';

/**
 * Duration of velocity sample in milliseconds
 * Uses a small window to calculate instantaneous velocity
 */
const velocitySampleDuration = 5; // ms

/**
 * Calculate generator velocity at a specific time
 *
 * Samples the generator's value at two nearby time points
 * and calculates the velocity based on the change.
 *
 * This is used by spring animations to determine if they've
 * settled (velocity below threshold).
 *
 * @param resolveValue - Function that returns value at time t
 * @param t - Current time in milliseconds
 * @param current - Current value (optimization to avoid recalculation)
 * @returns Velocity per second
 *
 * @example
 * ```ts
 * const velocity = calcGeneratorVelocity(
 *   (t) => springValue(t),
 *   1000,
 *   currentValue
 * );
 * ```
 */
export function calcGeneratorVelocity(
	resolveValue: (v: number) => number,
	t: number,
	current: number
): number {
	const prevT = Math.max(t - velocitySampleDuration, 0);
	return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}
