/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { frame, cancelFrame } from '../frameloop/index.js';
import { time } from '../frameloop/sync-time.js';
import type { FrameData } from '../frameloop/types.js';
import { secondsToMilliseconds } from './time-conversion.js';

export type DelayedFunction = (overshoot: number) => void;

/**
 * Timeout defined in ms
 */
export function delay(callback: DelayedFunction, timeout: number) {
	const start = time.now();

	const checkElapsed = ({ timestamp }: FrameData) => {
		const elapsed = timestamp - start;

		if (elapsed >= timeout) {
			cancelFrame(checkElapsed);
			callback(elapsed - timeout);
		}
	};

	frame.read(checkElapsed, true);

	return () => cancelFrame(checkElapsed);
}

export function delayInSeconds(callback: DelayedFunction, timeout: number) {
	return delay(callback, secondsToMilliseconds(timeout));
}
