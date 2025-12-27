import { mixNumber } from './number.js';
import { mixColor } from './color.js';
import { mixVisibility, invisibleValues } from './visibility.js';
import { mixImmediate } from './immediate.js';
import type { Mixer } from './types.js';
import { warnOnce } from '../warn-once.js';
import { complex } from '../../value-types/index.js';

/**
 * Mixable array types - arrays containing numbers, colors, or strings
 */
type MixableArray = (number | string)[];

/**
 * Mixable object types - objects with string keys and mixable values
 */
type MixableObject = { [key: string]: number | string };

/**
 * Gets the appropriate mixer function for a value
 * @param a - Value to determine mixer for
 * @returns Mixer function
 */
export function getMixer<T>(a: T): Mixer<any> | ((b: T) => Mixer<T>) {
	if (typeof a === 'number') {
		return (b: any) => (p: number) => mixNumber(a, b, p);
	} else if (typeof a === 'string') {
		return mixComplex(a as any);
	} else if (Array.isArray(a)) {
		return (b: T) => mixArray(a as MixableArray, b as MixableArray) as Mixer<T>;
	} else if (typeof a === 'object') {
		return (b: T) => mixObject(a as MixableObject, b as MixableObject) as Mixer<T>;
	}

	return mixImmediate(a, a) as any;
}

/**
 * Mixes array values
 * @param from - Starting array
 * @param to - Ending array
 * @returns Mixer function for arrays
 */
function mixArray(from: MixableArray, to: MixableArray): Mixer<MixableArray> {
	const output = [...from];
	const numValues = output.length;
	const blendValue = from.map((fromThis, i) => {
		const toValue = to[i];
		if (typeof fromThis === 'number' && typeof toValue === 'number') {
			return getMixer(fromThis)(toValue);
		}
		return getMixer(fromThis)(toValue as any);
	});

	return (v: number) => {
		for (let i = 0; i < numValues; i++) {
			output[i] = blendValue[i](v);
		}
		return output;
	};
}

/**
 * Mixes object values
 * @param origin - Starting object
 * @param target - Ending object
 * @returns Mixer function for objects
 */
function mixObject(origin: MixableObject, target: MixableObject): Mixer<MixableObject> {
	const output = { ...origin, ...target };
	const blendValue: { [key: string]: Mixer<any> } = {};

	for (const key in output) {
		if (origin[key] !== undefined && target[key] !== undefined) {
			const originValue = origin[key];
			const targetValue = target[key];
			if (typeof originValue === 'number' && typeof targetValue === 'number') {
				blendValue[key] = getMixer(originValue)(targetValue);
			} else {
				blendValue[key] = getMixer(originValue)(targetValue as any);
			}
		}
	}

	return (v: number) => {
		for (const key in blendValue) {
			output[key] = blendValue[key](v);
		}
		return output;
	};
}

/**
 * Mixes complex string values (like "rgba(0,0,0)" or "10px 20px")
 * @param origin - Starting complex value
 * @param target - Ending complex value (optional)
 * @returns Mixer function for complex values
 */
export function mixComplex(origin: string, target?: string): Mixer<string> {
	if (target === undefined) target = origin;

	// Handle visibility values
	if (invisibleValues.has(origin) || invisibleValues.has(target)) {
		return mixVisibility(origin, target);
	}

	// Try to parse as complex value
	const originValue = complex.parse(origin);
	const targetValue = complex.parse(target);

	// If parsing failed or values don't match, use immediate transition
	if (!originValue || !targetValue) {
		return mixImmediate(origin, target);
	}

	const mixer = mixArray(originValue as any, targetValue as any);
	const transformer = complex.createTransformer!(origin);

	return (v: number) => transformer(mixer(v));
}
