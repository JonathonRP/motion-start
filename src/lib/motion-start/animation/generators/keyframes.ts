/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { easeInOut } from '../../easing/ease.js';
import type { EasingFunction } from '../../easing/types.js';
import { isEasingArray } from '../../easing/utils/is-easing-array.js';
import { easingDefinitionToFunction } from '../../easing/utils/map.js';
import { interpolate } from '../../utils/interpolate.js';
import { defaultOffset } from '../../utils/offsets/default.js';
import { convertOffsetToTimes } from '../../utils/offsets/time.js';
import type { ValueAnimationOptions } from '../types.js';
import type { AnimationState, KeyframeGenerator } from './types.js';

export function defaultEasing(values: any[], easing?: EasingFunction): EasingFunction[] {
	return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}

export function keyframes<T extends string | number>({
	duration = 300,
	keyframes: keyframeValues,
	times,
	ease = 'easeInOut',
}: ValueAnimationOptions<T>): KeyframeGenerator<T> {
	/**
	 * Easing functions can be externally defined as strings. Here we convert them
	 * into actual functions.
	 */
	const easingFunctions = isEasingArray(ease) ? ease.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease);

	/**
	 * This is the Iterator-spec return value. We ensure it's mutable rather than using a generator
	 * to reduce GC during animation.
	 */
	const state: AnimationState<T> = {
		done: false,
		value: keyframeValues[0],
	};

	/**
	 * Create a times array based on the provided 0-1 offsets
	 */
	const absoluteTimes = convertOffsetToTimes(
		// Only use the provided offsets if they're the correct length
		// TODO Maybe we should warn here if there's a length mismatch
		times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues),
		duration
	);

	const mapTimeToKeyframe = interpolate<T>(absoluteTimes, keyframeValues, {
		ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions),
	});

	return {
		calculatedDuration: duration,
		next: (t: number) => {
			state.value = mapTimeToKeyframe(t);
			state.done = t >= duration;
			return state;
		},
	};
}
