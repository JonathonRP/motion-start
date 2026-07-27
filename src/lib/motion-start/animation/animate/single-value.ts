/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { animateMotionValue } from '../interfaces/motion-value.js';
import { motionValue as createMotionValue, type MotionValue } from '../../value/index.js';
import { isMotionValue } from '../../value/utils/is-motion-value.js';
import type { GenericKeyframesTarget } from '../../types.js';
import type { AnimationPlaybackControls, ValueAnimationTransition } from '../types.js';

export function animateSingleValue<V extends string | number>(
	value: MotionValue<V> | V,
	keyframes: V | GenericKeyframesTarget<V>,
	options?: ValueAnimationTransition
): AnimationPlaybackControls {
	const motionValue = isMotionValue(value) ? value : createMotionValue(value);

	motionValue.start(animateMotionValue('', motionValue, keyframes, options));

	return motionValue.animation!;
}
