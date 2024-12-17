/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Repeat } from '../../../../types';

const isNotNull = (value: unknown) => value !== null;

export function getFinalKeyframe<T>(keyframes: T[], { repeat, repeatType = 'loop' }: Repeat, finalKeyframe?: T): T {
	const resolvedKeyframes = keyframes.filter(isNotNull);
	const index = repeat && repeatType !== 'loop' && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;

	return !index || finalKeyframe === undefined ? resolvedKeyframes[index] : finalKeyframe;
}
