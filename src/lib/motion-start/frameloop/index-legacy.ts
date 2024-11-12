import { frame, cancelFrame } from '.';
import { stepsOrder } from './batcher';
import type { Process } from './types';

/**
 * @deprecated
 *
 * Import as `frame` instead.
 */
export const sync = frame;

/**
 * @deprecated
 *
 * Use cancelFrame(callback) instead.
 */
export const cancelSync = stepsOrder.reduce(
	(acc, key) => {
		acc[key] = (process: Process) => cancelFrame(process);
		return acc;
	},
	{} as Record<string, (process: Process) => void>
);
