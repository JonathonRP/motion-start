/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

// TODO: would love to use svelte Easing here instead.
import type { Easing } from 'popmotion';

/**
 * @public
 */
export interface TransformOptions<T> {
	/**
	 * Clamp values to within the given range. Defaults to `true`
	 *
	 * @public
	 */
	clamp?: boolean;
	/**
	 * Easing functions to use on the interpolations between each value in the input and output ranges.
	 *
	 * If provided as an array, the array must be one item shorter than the input and output ranges, as the easings apply to the transition **between** each.
	 *
	 * @public
	 */
	ease?: Easing | Easing[];
	/**
	 * @internal
	 */
	mixer?: (from: T, to: T) => (v: number) => any;
}

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { fixed } from './fix-process-env';
import { interpolate } from 'popmotion';
import type { CustomValueType } from '../types';

var isCustomValueType = (v: any): v is CustomValueType => typeof v === 'object' && v.mix;
var getMixer = (v: any) => (isCustomValueType(v) ? v.mix : undefined);

/**
 * Transforms numbers into other values by mapping them from an input range to an output range.
 * Returns the type of the input provided.
 *
 * @remarks
 *
 * Given an input range of `[0, 200]` and an output range of
 * `[0, 1]`, this function will return a value between `0` and `1`.
 * The input range must be a linear series of numbers. The output range
 * can be any supported value type, such as numbers, colors, shadows, arrays, objects and more.
 * Every value in the output range must be of the same type and in the same format.
 *
 * @motion
 *
 * ```jsx
 * import { transform } from "svelte-motion"
 *
 *
 *    const inputRange = [0, 200]
 *    const outputRange = [0, 1]
 *    const output = transform(100, inputRange, outputRange)
 *
 *    console.log(output) // Returns 0.5
 * ```
 *
 * @param inputValue - A number to transform between the input and output ranges.
 * @param inputRange - A linear series of numbers (either all increasing or decreasing).
 * @param outputRange - A series of numbers, colors, strings, or arrays/objects of those. Must be the same length as `inputRange`.
 * @param options - Clamp: Clamp values to within the given range. Defaults to `true`.
 *
 * @public
 */
function transform<T>(inputValue: number, inputRange: number[], outputRange: T[], options?: TransformOptions<T>): T;
/**
 * @motion
 *
 * Transforms numbers into other values by mapping them from an input range to an output range.
 *
 * Given an input range of `[0, 200]` and an output range of
 * `[0, 1]`, this function will return a value between `0` and `1`.
 * The input range must be a linear series of numbers. The output range
 * can be any supported value type, such as numbers, colors, shadows, arrays, objects and more.
 * Every value in the output range must be of the same type and in the same format.
 *
 * ```jsx

 * import { transform } from "svelte-motion"
 *
 * const inputRange = [-200, -100, 100, 200]
 * const outputRange = [0, 1, 1, 0]
 * const convertRange = transform(inputRange, outputRange)
 * const output = convertRange(-150)
 *
 * console.log(output) // Returns 0.5
 * ```
 *
 * @param inputRange - A linear series of numbers (either all increasing or decreasing).
 * @param outputRange - A series of numbers, colors or strings. Must be the same length as `inputRange`.
 * @param options - Clamp: clamp values to within the given range. Defaults to `true`.
 *
 * @public
 */
function transform<T>(inputRange: number[], outputRange: T[], options?: TransformOptions<T>): (inputValue: number) => T;
function transform<T>(...args: [number, number[], T[], TransformOptions<T>?] | [number[], T[], TransformOptions<T>?]) {
	var useImmediate = !Array.isArray(args[0]);
	var argOffset = useImmediate ? 0 : -1;
	var inputValue = args[0 + argOffset] as number;
	var inputRange = args[1 + argOffset] as number[];
	var outputRange = args[2 + argOffset] as T[];
	var options = args[3 + argOffset] as TransformOptions<T>;
	var interpolator = interpolate(inputRange, outputRange, Object.assign({ mixer: getMixer(outputRange[0]) }, options));
	return useImmediate ? interpolator(inputValue) : interpolator;
}

export { transform };
