/**
 * Synchronized Time Utility
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Provides a synchronized time utility that maintains consistent time values
 * within a single synchronous execution context. This is crucial for ensuring
 * that multiple animations started in the same frame use the same timestamp.
 */

import { MotionGlobalConfig } from '../utils/GlobalConfig.js';
import { frameData } from './frame.js';

/**
 * Current synchronized time value
 * Undefined until first access
 */
let now: number | undefined;

/**
 * Clear the synchronized time value
 * Called via microtask to reset after synchronous execution completes
 */
function clearTime() {
	now = undefined;
}

/**
 * Synchronized time utility
 *
 * An eventloop-synchronous alternative to performance.now().
 *
 * Ensures that time measurements remain consistent within a synchronous context.
 * Usually calling performance.now() twice within the same synchronous context
 * will return different values which isn't useful for animations when we're trying
 * to sync animations to the same frame.
 *
 * Example:
 * ```ts
 * const t1 = time.now(); // 100.5
 * const t2 = time.now(); // 100.5 (same value within sync context)
 * await Promise.resolve();
 * const t3 = time.now(); // 101.2 (new value after microtask)
 * ```
 */
export const time = {
	/**
	 * Get the current synchronized time
	 *
	 * @returns Current timestamp in milliseconds
	 */
	now: (): number => {
		if (now === undefined) {
			time.set(
				frameData.isProcessing || MotionGlobalConfig.useManualTiming
					? frameData.timestamp
					: performance.now()
			);
		}

		return now!;
	},

	/**
	 * Set a new synchronized time value
	 *
	 * @param newTime - The new time value in milliseconds
	 */
	set: (newTime: number) => {
		now = newTime;
		// Clear the time value after the current microtask queue is processed
		queueMicrotask(clearTime);
	},
};
