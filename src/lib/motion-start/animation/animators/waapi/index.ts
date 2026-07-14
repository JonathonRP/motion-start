/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { mapEasingToNativeEasing } from './easing';
import type { NativeAnimationOptions } from './types';

export function startWaapiAnimation(
	element: Element,
	valueName: string,
	keyframes: string[] | number[],
	{ delay = 0, duration = 300, repeat = 0, repeatType = 'loop', ease, times }: NativeAnimationOptions = {}
) {
	const keyframeOptions: PropertyIndexedKeyframes = { [valueName]: keyframes };
	if (times) keyframeOptions.offset = times;

	const easing = mapEasingToNativeEasing(ease, duration);

	/**
	 * If this is an easing array, apply to keyframes, not animation as a whole
	 */
	if (Array.isArray(easing)) keyframeOptions.easing = easing;

	return element.animate(keyframeOptions, {
		delay,
		duration,
		easing: !Array.isArray(easing) ? easing : 'linear',
		fill: 'both',
		iterations: repeat + 1,
		direction: repeatType === 'reverse' ? 'alternate' : 'normal',
	});
}
