/**
 * Keyframe Animation Generator
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Generates values for keyframe-based animations with easing.
 * Supports multiple keyframes with custom timing and easing functions.
 */

import { easeInOut } from '../../easing/ease.js';
import type { EasingFunction } from '../../easing/types.js';
import { isEasingArray, easingDefinitionToFunction } from '../utils/easing.js';
import { interpolate } from '../../utils/interpolate.js';
import { defaultOffset } from '../../utils/offsets/default.js';
import { convertOffsetToTimes } from '../../utils/offsets/time.js';
import type { Easing } from '../../types.js';
import type { AnimationState, KeyframeGenerator } from './types.js';

/**
 * Options for keyframe animation
 */
export interface KeyframeOptions<T> {
	/**
	 * Animation duration in milliseconds
	 * @default 300
	 */
	duration?: number;

	/**
	 * Array of keyframe values to animate through
	 */
	keyframes: T[];

	/**
	 * Custom timing offsets for keyframes (0-1)
	 * If not provided, keyframes are evenly distributed
	 */
	times?: number[];

	/**
	 * Easing function(s) to apply
	 * Can be a single easing or array of easings (one per segment)
	 * @default "easeInOut"
	 */
	ease?: Easing | Easing[];
}

/**
 * Create default easing array for keyframe segments
 *
 * @param values - Array of keyframe values
 * @param easing - Single easing function to use for all segments
 * @returns Array of easing functions (one per segment, length = values.length - 1)
 */
export function defaultEasing(values: any[], easing?: EasingFunction): EasingFunction[] {
	return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}

/**
 * Create a keyframe animation generator
 *
 * Interpolates between keyframe values over time using easing functions.
 * The generator returns the current value at each time step.
 *
 * @param options - Keyframe animation options
 * @returns A keyframe generator that can be used to animate values
 *
 * @example
 * ```ts
 * const generator = keyframes({
 *   keyframes: [0, 100, 50],
 *   duration: 1000,
 *   ease: "easeInOut"
 * });
 *
 * // Get value at 500ms
 * const state = generator.next(500);
 * console.log(state.value); // ~100
 * console.log(state.done);  // false
 * ```
 */
export function keyframes<T extends string | number>({
	duration = 300,
	keyframes: keyframeValues,
	times,
	ease = 'easeInOut',
}: KeyframeOptions<T>): KeyframeGenerator<T> {
	/**
	 * Easing functions can be externally defined as strings. Here we convert them
	 * into actual functions.
	 */
	const easingFunctions = isEasingArray(ease)
		? ease.map(easingDefinitionToFunction)
		: easingDefinitionToFunction(ease);

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
		times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues),
		duration
	);

	/**
	 * Create interpolator that maps time to keyframe value
	 */
	const mapTimeToKeyframe = interpolate<T>(absoluteTimes, keyframeValues, {
		ease: Array.isArray(easingFunctions)
			? easingFunctions
			: defaultEasing(keyframeValues, easingFunctions),
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
