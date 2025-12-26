import { mixNumber } from './number.js';
import { getMixer } from './complex.js';
import type { Mixer } from './types.js';

/**
 * Mix function - interpolates between two values
 * Supports numbers, colors, complex values, and more
 */
export function mix<T>(from: T, to: T): Mixer<T>;
export function mix(from: number, to: number, p: number): number;
export function mix<T>(from: T, to: T, p?: number): Mixer<T> | number {
	if (typeof from === 'number' && typeof to === 'number' && p !== undefined) {
		return mixNumber(from, to, p);
	}

	const mixer = getMixer(from);
	return (mixer as any)(to) as Mixer<T>;
}

// Re-export types and utilities
export type { Mixer } from './types.js';
export { mixNumber } from './number.js';
export { mixColor } from './color.js';
export { mixComplex, getMixer } from './complex.js';
export { mixVisibility, invisibleValues } from './visibility.js';
export { mixImmediate } from './immediate.js';
