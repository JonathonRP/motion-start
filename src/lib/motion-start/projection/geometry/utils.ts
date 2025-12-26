/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Axis, AxisDelta, Box, Delta } from './types.js';
import { calcLength } from './delta-calc.js';

/**
 * Check if a delta is zero (i.e., no transformation)
 */
export function isDeltaZero(delta: Delta): boolean {
	return delta.x.translate === 0 && delta.y.translate === 0 && delta.x.scale === 1 && delta.y.scale === 1;
}

/**
 * Compare two axes for equality
 */
export function axisEquals(a: Axis, b: Axis): boolean {
	return a.min === b.min && a.max === b.max;
}

/**
 * Compare two boxes for equality
 */
export function boxEquals(a: Box, b: Box): boolean {
	return axisEquals(a.x, b.x) && axisEquals(a.y, b.y);
}

/**
 * Compare two axes for equality with rounding
 */
export function axisEqualsRounded(a: Axis, b: Axis): boolean {
	return Math.round(a.min) === Math.round(b.min) && Math.round(a.max) === Math.round(b.max);
}

/**
 * Compare two boxes for equality with rounding
 */
export function boxEqualsRounded(a: Box, b: Box): boolean {
	return axisEqualsRounded(a.x, b.x) && axisEqualsRounded(a.y, b.y);
}

/**
 * Compare two axis deltas for equality
 */
export function axisDeltaEquals(a: AxisDelta, b: AxisDelta): boolean {
	return a.translate === b.translate && a.scale === b.scale && a.origin === b.origin && a.originPoint === b.originPoint;
}

/**
 * Calculate the aspect ratio of a box
 */
export function aspectRatio(box: Box): number {
	return calcLength(box.x) / calcLength(box.y);
}
