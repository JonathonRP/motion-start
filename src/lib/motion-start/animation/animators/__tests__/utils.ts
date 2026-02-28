/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 * Ported from packages/framer-motion/src/animation/animators/__tests__/utils.ts
 */

import { frameData } from '../../../frameloop/frame';
import { time } from '../../../frameloop/sync-time';
import type { KeyframeGenerator } from '../../generators/types';

export const syncDriver = (interval = 10) => {
	time.set(0);

	const driver = (update: (v: number) => void) => {
		let isRunning = true;
		let elapsed = 0;

		frameData.isProcessing = true;
		frameData.delta = interval;
		frameData.timestamp = elapsed;

		return {
			start: () => {
				isRunning = true;
				setTimeout(() => {
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
