/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { getMixer } from './complex.js';
import { mixNumber as mixNumberImmediate } from './number.js';
import type { Mixer } from './types.js';

export function mix<T>(from: T, to: T): Mixer<T>;
export function mix(from: number, to: number, p: number): number;
export function mix<T>(from: T, to: T, p?: T): Mixer<T> | number {
	if (typeof from === 'number' && typeof to === 'number' && typeof p === 'number') {
		return mixNumberImmediate(from, to, p);
	}

	const mixer = getMixer(from);
	return mixer(from, to) as Mixer<T>;
}
