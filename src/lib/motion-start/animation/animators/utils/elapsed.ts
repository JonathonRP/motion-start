/**
 * Animation Elapsed Time Utilities
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Utilities for calculating elapsed time and progress through animations.
 */

/**
 * Calculate the elapsed time since the animation started
 *
 * @param startTime - When the animation started (ms)
 * @param currentTime - Current time (ms)
 * @param holdTime - If paused, the time at which it was paused (ms)
 * @param speed - Playback speed multiplier
 * @returns Elapsed time in milliseconds
 */
export function calcElapsedTime(
	startTime: number,
	currentTime: number,
	holdTime: number | null,
	speed: number
): number {
	if (holdTime !== null) {
		// Animation is paused - return the held time
		return holdTime;
	}

	// Calculate actual elapsed time with speed multiplier
	return (currentTime - startTime) * speed;
}

/**
 * Calculate animation progress (0-1)
 *
 * @param elapsed - Elapsed time (ms)
 * @param duration - Total duration (ms)
 * @returns Progress value between 0 and 1
 */
export function calcProgress(elapsed: number, duration: number): number {
	if (duration === 0) return 1;
	return Math.max(0, Math.min(1, elapsed / duration));
}

/**
 * Calculate the current iteration of a repeating animation
 *
 * @param elapsed - Total elapsed time (ms)
 * @param duration - Duration of single iteration (ms)
 * @param repeatDelay - Delay between iterations (ms)
 * @returns Current iteration number (0-based)
 */
export function calcIteration(
	elapsed: number,
	duration: number,
	repeatDelay: number
): number {
	if (duration === 0) return 0;

	const cycleDuration = duration + repeatDelay;
	return Math.floor(elapsed / cycleDuration);
}

/**
 * Calculate progress within the current iteration
 *
 * @param elapsed - Total elapsed time (ms)
 * @param duration - Duration of single iteration (ms)
 * @param repeatDelay - Delay between iterations (ms)
 * @returns Progress value between 0 and 1 for current iteration
 */
export function calcIterationProgress(
	elapsed: number,
	duration: number,
	repeatDelay: number
): number {
	if (duration === 0) return 1;

	const cycleDuration = duration + repeatDelay;
	const iterationElapsed = elapsed % cycleDuration;

	// If we're in the repeat delay period, return 1 (end of iteration)
	if (iterationElapsed > duration) {
		return 1;
	}

	return calcProgress(iterationElapsed, duration);
}

/**
 * Apply repeat type transformation to progress
 *
 * @param progress - Raw progress (0-1)
 * @param iteration - Current iteration number
 * @param repeatType - How to repeat: 'loop', 'reverse', or 'mirror'
 * @returns Transformed progress value
 */
export function applyRepeatType(
	progress: number,
	iteration: number,
	repeatType: 'loop' | 'reverse' | 'mirror'
): number {
	switch (repeatType) {
		case 'reverse':
			// Reverse direction on odd iterations
			return iteration % 2 === 0 ? progress : 1 - progress;

		case 'mirror':
			// Mirror the progress on odd iterations
			return iteration % 2 === 0 ? progress : 1 - progress;

		case 'loop':
		default:
			// Always play forward
			return progress;
	}
}
