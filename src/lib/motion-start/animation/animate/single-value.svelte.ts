/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { animateMotionValue } from '../interfaces/motion-value.svelte';
import { motionValue as createMotionValue, type MotionValue } from '../../value/index.svelte';
import { isMotionValue } from '../../value/utils/is-motion-value';
import type { GenericKeyframesTarget } from '../../types';
import type { AnimationPlaybackControls, ValueAnimationTransition } from '../types';

export function animateSingleValue<V extends string | number>(
	value: MotionValue<V> | V,
	keyframes: V | GenericKeyframesTarget<V>,
	options?: ValueAnimationTransition
): AnimationPlaybackControls {
	const motionValue = isMotionValue(value) ? value : createMotionValue(value);

	motionValue.start(animateMotionValue('', motionValue, keyframes, options));

	return motionValue.animation!;
}
