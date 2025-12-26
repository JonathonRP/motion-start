/**
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 */

import { clamp } from './utils/clamp';
import type { EasingFunction } from './types';

/**
 * Direction for step easing - determines when steps occur.
 * - "start": Steps occur at the start of each interval (ceil)
 * - "end": Steps occur at the end of each interval (floor)
 */
export type Direction = 'start' | 'end';

/**
 * Creates a stepped easing function that discretizes progress into steps.
 *
 * Mathematical explanation:
 * The function divides the continuous progress range [0, 1] into discrete steps:
 *
 * 1. Boundary adjustment:
 *    - "end": Limits to ~0.999 to prevent rounding to next step
 *    - "start": Limits to ~0.001 to ensure we're past 0
 *
 * 2. Expansion: progress * numSteps
 *    - Maps [0, 1] to [0, numSteps]
 *
 * 3. Rounding:
 *    - "end": floor() - steps at end of interval
 *    - "start": ceil() - steps at start of interval
 *
 * 4. Normalization: result / numSteps
 *    - Maps back to [0, 1] range
 *    - Clamped to ensure valid output
 *
 * Visual description:
 * Creates a staircase pattern instead of smooth motion.
 * - The animation jumps instantly between discrete values
 * - No interpolation between steps
 * - Like a digital clock vs an analog clock
 *
 * The direction parameter controls timing:
 * - "end": Animation stays at each step then jumps to next (default)
 * - "start": Animation jumps immediately to each step
 *
 * Common use cases:
 * - Sprite sheet animations (frame-by-frame)
 * - Counter animations (discrete values)
 * - Pixel art animations
 * - Loading indicators with distinct stages
 * - Any animation requiring discrete steps
 *
 * Dependencies: clamp
 *
 * @param numSteps - Number of steps to divide animation into
 * @param direction - When steps occur: "start" or "end" (default: "end")
 * @returns A stepped easing function
 *
 * @example
 * ```ts
 * // 4 steps, jumping at end of each interval
 * const stepsEnd = steps(4, "end");
 * stepsEnd(0) // 0
 * stepsEnd(0.1) // 0
 * stepsEnd(0.26) // 0.25
 * stepsEnd(0.5) // 0.5
 * stepsEnd(0.99) // 0.75
 * stepsEnd(1) // 1
 *
 * // 4 steps, jumping at start of each interval
 * const stepsStart = steps(4, "start");
 * stepsStart(0) // 0
 * stepsStart(0.01) // 0.25
 * stepsStart(0.26) // 0.5
 * stepsStart(0.5) // 0.5
 * stepsStart(0.76) // 1
 * stepsStart(1) // 1
 *
 * // Use for frame-based animation (10 frames)
 * const frameEasing = steps(10);
 * // Progress 0.35 → frame 3 (indices 0-9)
 * const frameIndex = Math.floor(frameEasing(0.35) * 10); // 3
 * ```
 */
export function steps(numSteps: number, direction: Direction = 'end'): EasingFunction {
	return (progress: number) => {
		// Adjust progress to prevent edge case rounding issues
		progress =
			direction === 'end'
				? Math.min(progress, 0.999) // Prevent rounding up to next step
				: Math.max(progress, 0.001); // Ensure we're past 0 for ceiling

		// Scale progress to number of steps
		const expanded = progress * numSteps;

		// Round based on direction
		const rounded = direction === 'end' ? Math.floor(expanded) : Math.ceil(expanded);

		// Normalize back to 0-1 range and clamp
		return clamp(0, 1, rounded / numSteps);
	};
}
