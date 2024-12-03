/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { velocityPerSecond } from '../../../utils/velocity-per-second';

const velocitySampleDuration = 5; // ms

export function calcGeneratorVelocity(resolveValue: (v: number) => number, t: number, current: number) {
	const prevT = Math.max(t - velocitySampleDuration, 0);
	return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}
