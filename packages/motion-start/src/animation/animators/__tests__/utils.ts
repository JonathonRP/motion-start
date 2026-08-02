/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 * Ported from packages/framer-motion/src/animation/animators/__tests__/utils.ts
 */

import { frameData } from '../../../frameloop/frame.js';
import { time } from '../../../frameloop/sync-time.js';
import type { KeyframeGenerator } from '../../generators/types.js';

export const syncDriver = (interval = 10) => {
	time.set(0);

	const driver = (update: (v: number) => void) => {
		let isRunning = true;
		let elapsed = 0;
		let pendingUpdate: ReturnType<typeof setTimeout> | undefined;

		frameData.isProcessing = true;
		frameData.delta = interval;
		frameData.timestamp = elapsed;

		return {
			start: () => {
				isRunning = true;
				pendingUpdate = setTimeout(() => {
					pendingUpdate = undefined;
					if (!isRunning) return;
					time.set(elapsed);
					update(elapsed);
					while (isRunning) {
						elapsed += interval;
						time.set(elapsed);
						update(elapsed);
					}
				}, 0);
			},
			stop: () => {
				frameData.isProcessing = false;
				isRunning = false;
				if (pendingUpdate !== undefined) {
					clearTimeout(pendingUpdate);
					pendingUpdate = undefined;
				}
			},
			now: () => elapsed,
		};
	};

	return driver;
};

/**
 * A sync driver whose clock persists across driver instances, mimicking the
 * real frameloop driver where time keeps advancing after an animation has
 * finished and its driver has been torn down.
 */
export const persistentSyncDriver = (interval = 10) => {
	let elapsed = 0;
	time.set(elapsed);

	const driver = (update: (v: number) => void) => {
		let isRunning = true;
		let pendingUpdate: ReturnType<typeof setTimeout> | undefined;

		frameData.isProcessing = true;
		frameData.delta = interval;
		frameData.timestamp = elapsed;

		return {
			start: () => {
				isRunning = true;
				pendingUpdate = setTimeout(() => {
					pendingUpdate = undefined;
					if (!isRunning) return;
					time.set(elapsed);
					update(elapsed);
					while (isRunning) {
						elapsed += interval;
						time.set(elapsed);
						update(elapsed);
					}
				}, 0);
			},
			stop: () => {
				frameData.isProcessing = false;
				isRunning = false;
				if (pendingUpdate !== undefined) {
					clearTimeout(pendingUpdate);
					pendingUpdate = undefined;
				}
			},
			now: () => elapsed,
		};
	};

	return driver;
};

export function animateSync(animation: KeyframeGenerator<string | number>, timeStep = 200, round = true) {
	const output: Array<string | number> = [];
	let step = 0;
	let done = false;

	while (!done) {
		const latest = animation.next(step * timeStep);
		output.push(round && typeof latest.value === 'number' ? Math.round(latest.value) : latest.value);
		done = latest.done;
		step++;
	}

	return output;
}
