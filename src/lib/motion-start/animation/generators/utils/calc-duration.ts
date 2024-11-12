/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { KeyframeGenerator } from '../types';

/**
 * Implement a practical max duration for keyframe generation
 * to prevent infinite loops
 */
export const maxGeneratorDuration = 20_000;
export function calcGeneratorDuration(generator: KeyframeGenerator<unknown>) {
	let duration = 0;
	const timeStep = 50;
	let state = generator.next(duration);
	while (!state.done && duration < maxGeneratorDuration) {
		duration += timeStep;
		state = generator.next(duration);
	}

	return duration >= maxGeneratorDuration ? Number.POSITIVE_INFINITY : duration;
}
