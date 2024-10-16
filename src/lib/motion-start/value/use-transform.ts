import type { TransformOptions } from '../utils/transform';
/** 
 based on framer-motion@4.1.17,
 Copyright (c) 2018 Framer B.V.
 */
import type { MotionValue } from '.';

import { transform } from '../utils/transform';
import { useCombineMotionValues } from './use-combine-values';

export type InputRange = number[];
type SingleTransformer<I, O> = (input: I) => O;
type MultiTransformer<I, O> = (input: I[]) => O;
type Transformer<I, O> =
	| SingleTransformer<I, O>
	/**
	 * Ideally, this would be typed <I, O> in all instances, but to type this
	 * more accurately requires the tuple support in TypeScript 4:
	 * https://gist.github.com/InventingWithMonster/c4d23752a0fae7888596c4ff6d92733a
	 */
	| MultiTransformer<string | number, O>;
/**
 * Create a `MotionValue` that transforms the output of another `MotionValue` by mapping it from one range of values into another.
 *
 * @remarks
 *
 * Given an input range of `[-200, -100, 100, 200]` and an output range of
 * `[0, 1, 1, 0]`, the returned `MotionValue` will:
 *
 * - When provided a value between `-200` and `-100`, will return a value between `0` and  `1`.
 * - When provided a value between `-100` and `100`, will return `1`.
 * - When provided a value between `100` and `200`, will return a value between `1` and  `0`
 *
 *
 * The input range must be a linear series of numbers. The output range
 * can be any value type supported by Framer Motion: numbers, colors, shadows, etc.
 *
 * Every value in the output range must be of the same type and in the same format.
 *
 * @motion
 *
 * ```jsx
 * <script>
 *   const x = useMotionValue(0)
 *   const xRange = [-200, -100, 100, 200]
 *   const opacityRange = [0, 1, 1, 0]
 *   const opacity = useTransform(x, xRange, opacityRange)
 * </script>
 *
 * <Motion let:motion
 *      animate={{ x: 200 }}
 *      style={{ opacity, x }}
 *  >
 *     <div use:motion/>
 *  </Motion>
 * ```
 *
 * @param inputValue - `MotionValue`
 * @param inputRange - A linear series of numbers (either all increasing or decreasing)
 * @param outputRange - A series of numbers, colors or strings. Must be the same length as `inputRange`.
 * @param options -
 *
 *  - clamp: boolean. Clamp values to within the given range. Defaults to `true`
 *  - ease: EasingFunction[]. Easing functions to use on the interpolations between each value in the input and output ranges. If provided as an array, the array must be one item shorter than the input and output ranges, as the easings apply to the transition between each.
 *
 * @returns `MotionValue & { reset: (value: MotionValue<number>, inputRange: InputRange, outputRange: O[], options?: TransformOptions<O>) => void }`
 *
 * @public
 */
// @ts-expect-error
export function useTransform<I, O>(
	value: MotionValue<number>,
	inputRange: InputRange,
	outputRange: O[],
	options?: TransformOptions<O>
): MotionValue<O> & {
	reset: (value: MotionValue<number>, inputRange: InputRange, outputRange: O[], options?: TransformOptions<O>) => void;
};
/**
 * Create a `MotionValue` that transforms the output of another `MotionValue` through a function.
 * In this example, `y` will always be double `x`.
 *
 * @motion
 *
 * ```jsx
 * <script>
 *   const x = useMotionValue(10)
 *   const y = useTransform(x, value => value * 2)
 * </script>
 *
 * <Motion let:motion style={{ x, y }}>
 *   <div use:motion/>
 * </Motion>
 * ```
 *
 * @param input - A `MotionValue` that will pass its latest value through `transform` to update the returned `MotionValue`.
 * @param transform - A function that accepts the latest value from `input` and returns a new value.
 * @returns `MotionValue`
 *
 * @public
 */
export function useTransform<I, O>(
	input: MotionValue<I>,
	transformer: SingleTransformer<I, O>
): MotionValue<O> & { reset: (input: MotionValue<I>, transformer: SingleTransformer<I, O>) => void };
/**
 * Pass an array of `MotionValue`s and a function to combine them. In this example, `z` will be the `x` multiplied by `y`.
 *
 * @motion
 *
 * ```jsx
 * <script>
 *   const x = useMotionValue(0)
 *   const y = useMotionValue(0)
 *   const z = useTransform([x, y], [latestX, latestY] => latestX * latestY)
 * </script>
 *
 * <Motion let:motion style={{ x, y, z }}>
 *   return <div use:motion/>
 * </Motion>
 * ```
 *
 * @param input - An array of `MotionValue`s that will pass their latest values through `transform` to update the returned `MotionValue`.
 * @param transform - A function that accepts the latest values from `input` and returns a new value.
 * @returns `MotionValue`
 *
 * @public
 */
// export function useTransform<I, O>(input: MotionValue<string | number>[], transformer: MultiTransformer<I, O>):
//     MotionValue<O> & { reset: (input: MotionValue<string | number>[], transformer: MultiTransformer<I, O>) => void };
// export function useTransform<I, O>(
// 	input: MotionValue<string>[] | MotionValue<number>[] | MotionValue<string | number>[],
// 	transformer: MultiTransformer<I, O>
// ): MotionValue<O> & { reset: (input: MotionValue<string>[] | MotionValue<number>[] | MotionValue<string | number>[], transformer: MultiTransformer<I, O>) => void };
// export function useTransform<I, O>(transformer: () => O): MotionValue<O>;
/**
 * Pass an array of `MotionValue`s and a function to combine them. In this example, `z` will be the `x` multiplied by `y`.
 *
 * ```jsx
 * export const MyComponent = () => {
 *   const x = useMotionValue(0)
 *   const y = useMotionValue(0)
 *   const z = useTransform([x, y], ([latestX, latestY]) => latestX * latestY)
 *
 *   return <motion.div style={{ x, y, z }} />
 * }
 * ```
 *
 * @param input - An array of `MotionValue`s that will pass their latest values through `transform` to update the returned `MotionValue`.
 * @param transform - A function that accepts the latest values from `input` and returns a new value.
 * @returns `MotionValue`
 *
 * @public
 */
export function useTransform<I, O>(
	input: MotionValue<I> | MotionValue<string>[] | MotionValue<number>[] | MotionValue<string | number>[] | (() => O),
	inputRangeOrTransformer?: InputRange | Transformer<I, O>,
	outputRange?: O[],
	options?: TransformOptions<O>
) {
	type Input = typeof input;
	type inputRangeOrTransformer = typeof inputRangeOrTransformer;
	type OutputRange = typeof outputRange;
	type Options = typeof options;// @ts-expect-error
	const latest: I & (string | number)[] & number & any[{}] = [] as any;

	const update = (
		input: Input,
		inputRangeOrTransformer?: inputRangeOrTransformer,
		outputRange?: OutputRange,
		options?: Options
	) => {
		const transformer =
			typeof inputRangeOrTransformer === 'function'
				? inputRangeOrTransformer
				: transform(inputRangeOrTransformer!, outputRange!, options);
		const values = Array.isArray(input) ? input : [input];
		const _transformer = Array.isArray(input) ? transformer : ([latest]: any[]) => transformer(latest);
		return [
			values,
			() => {
				latest.length = 0;
				const numValues = values.length;
				for (let i = 0; i < numValues; i++) {
					// @ts-expect-error
					latest[i] = values[i].get();
				}
				return _transformer(latest);
			},
		] as const;
	};
	const comb = useCombineMotionValues(...update(input, inputRangeOrTransformer, outputRange, options));

	(comb as any).updateInner = comb.reset;

	comb.reset = (input, inputRangeOrTransformer?, outputRange?: OutputRange, options?: Options) =>
		(comb as any).updateInner(...update(input, inputRangeOrTransformer, outputRange, options));
	return comb;
}
// export { default as UseTransform } from './UseTransform.svelte';
