/**
 * Duration Calculation Utilities
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Utilities for calculating animation duration from generators.
 * Some generators (like springs) don't have a fixed duration,
 * so we need to iterate them to determine when they complete.
 */

import type { KeyframeGenerator } from '../types.js';

/**
 * Implement a practical max duration for keyframe generation
 * to prevent infinite loops
 *
 * 20 seconds should be more than enough for any reasonable animation
 */
export const maxGeneratorDuration = 20_000;

/**
 * Calculate duration by iterating generator
 *
 * Steps through the generator in fixed time increments
 * until it reports done, or until maxGeneratorDuration is reached.
 *
 * This is used for generators that don't have a calculatedDuration
 * (like spring animations with velocity-based completion).
 *
 * @param generator - The generator to measure
 * @returns Duration in milliseconds, or Infinity if it exceeds the max
 *
 * @example
 * ```ts
 * const springGen = spring({
 *   keyframes: [0, 100],
 *   stiffness: 100,
 *   damping: 10
 * });
 *
 * const duration = calcGeneratorDuration(springGen);
 * console.log(duration); // e.g., 842
 * ```
 */
export function calcGeneratorDuration(generator: KeyframeGenerator<unknown>): number {
	let duration = 0;
	const timeStep = 50;
	let state = generator.next(duration);

	while (!state.done && duration < maxGeneratorDuration) {
		duration += timeStep;
		state = generator.next(duration);
	}

	return duration >= maxGeneratorDuration ? Infinity : duration;
}
