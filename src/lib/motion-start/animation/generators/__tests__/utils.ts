/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { KeyframeGenerator } from '../types';

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
