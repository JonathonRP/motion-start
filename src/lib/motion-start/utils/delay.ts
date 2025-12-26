import { frame, cancelFrame } from '../frameloop/frame.js';
import { time } from '../frameloop/sync-time.js';
import { millisecondsToSeconds, secondsToMilliseconds } from './time-conversion.js';

/**
 * Executes a callback after a specified delay in milliseconds
 * Uses the frame loop for precise timing
 * @param callback - Function to execute
 * @param timeout - Delay in milliseconds
 * @returns Cancellation function
 */
export function delay(callback: (overshoot: number) => void, timeout: number) {
	const start = time.now();
	const checkElapsed = ({ timestamp }: { timestamp: number }) => {
		const elapsed = timestamp - start;
		if (elapsed >= timeout) {
			callback(elapsed - timeout);
			cancelFrame(checkElapsed);
		}
	};

	frame.read(checkElapsed, true);

	return () => cancelFrame(checkElapsed);
}

/**
 * Executes a callback after a specified delay in seconds
 * Convenience wrapper around delay()
 * @param callback - Function to execute
 * @param timeout - Delay in seconds
 * @returns Cancellation function
 */
export const delayInSeconds = (callback: (overshoot: number) => void, timeout: number) =>
	delay(callback, secondsToMilliseconds(timeout));
