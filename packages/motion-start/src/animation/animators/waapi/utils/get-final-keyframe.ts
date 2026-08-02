/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Repeat } from '../../../../types.js';

const isNotNull = (value: unknown) => value !== null;

export function getFinalKeyframe<T>(
	keyframes: T[],
	{ repeat, repeatType = 'loop' }: Repeat,
	finalKeyframe?: T,
	speed = 1
): T {
	const resolvedKeyframes = keyframes.filter(isNotNull);

	/**
	 * When playing in reverse the animation ends on its first keyframe, as do
	 * animations that finish on an odd iteration of a non-looping repeat.
	 */
	const useFirstKeyframe = speed < 0 || (repeat && repeatType !== 'loop' && repeat % 2 === 1);
	const index = useFirstKeyframe ? 0 : resolvedKeyframes.length - 1;

	return !index || finalKeyframe === undefined ? resolvedKeyframes[index] : finalKeyframe;
}
