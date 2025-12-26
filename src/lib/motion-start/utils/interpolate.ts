import type { Easing } from '../easing/types.js';
import { invariant } from './errors.js';
import { clamp } from './clamp.js';
import { pipe } from './pipe.js';
import { progress } from './progress.js';
import { noop } from './noop.js';
import { mix } from './mix/index.js';

type Mix<T> = (v: number) => T;

export type MixerFactory<T> = (from: T, to: T) => Mix<T>;

export interface InterpolateOptions<T> {
	clamp?: boolean;
	ease?: Easing | Easing[];
	mixer?: MixerFactory<T>;
}

/**
 * Create a function that maps from a numerical input array to a generic output array.
 *
 * Accepts:
 *   - Numbers
 *   - Colors (hex, hsl, hsla, rgb, rgba)
 *   - Complex (combinations of one or more numbers or strings)
 *
 * ```jsx
 * const mixColor = interpolate([0, 1], ['#fff', '#000'])
 *
 * mixColor(0.5) // 'rgba(128, 128, 128, 1)'
 * ```
 *
 * @public
 */
export function interpolate<T>(
	input: number[],
	output: T[],
	{ clamp: isClamp = true, ease, mixer }: InterpolateOptions<T> = {}
) {
	const inputLength = input.length;

	invariant(
		inputLength === output.length,
		'Both input and output ranges must be the same length'
	);

	/**
	 * If we're only provided a single input, we can just return a function
	 * that returns the output.
	 */
	if (inputLength === 1) return () => output[0];

	if (inputLength === 2 && input[0] === input[1]) return () => output[1];

	// If input runs highest -> lowest, reverse both arrays
	if (input[0] > input[input.length - 1]) {
		input = [...input].reverse();
		output = [...output].reverse();
	}

	const mixers = createMixers(output, ease, mixer);

	const numMixers = mixers.length;
	const interpolator = (v: number) => {
		let i = 0;
		if (numMixers > 1) {
			for (; i < input.length - 2; i++) {
				if (v < input[i + 1]) break;
			}
		}

		const progressInRange = progress(input[i], input[i + 1], v);
		return mixers[i](progressInRange);
	};

	return isClamp
		? (v: number) => interpolator(clamp(input[0], input[input.length - 1], v))
		: interpolator;
}

function createMixers<T>(
	output: T[],
	easing?: Easing | Easing[],
	customMixer?: MixerFactory<T>
): Mix<T>[] {
	const mixers: Mix<T>[] = [];
	const mixerFactory = customMixer || mix;
	const numMixers = output.length - 1;

	for (let i = 0; i < numMixers; i++) {
		let mixerFn = mixerFactory(output[i], output[i + 1]);

		if (easing) {
			const easingFunction = Array.isArray(easing) ? (easing[i] || noop) : easing;
			mixerFn = pipe(easingFunction as Function, mixerFn as any) as Mix<T>;
		}

		mixers.push(mixerFn as Mix<T>);
	}

	return mixers;
}
