/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { mixNumber } from '../../utils/mix/number.js';
import type { ResolvedValues } from '../../render/types.js';
import type { Axis, Box } from './types.js';
import { scalePoint } from './delta-apply.js';

/**
 * Remove a delta from a point. This is essentially the steps of applyPointDelta in reverse
 */
export function removePointDelta(
	point: number,
	translate: number,
	scale: number,
	originPoint: number,
	boxScale?: number
): number {
	point -= translate;
	point = scalePoint(point, 1 / scale, originPoint);

	if (boxScale !== undefined) {
		point = scalePoint(point, 1 / boxScale, originPoint);
	}

	return point;
}

/**
 * Remove a delta from an axis. This is essentially the steps of applyAxisDelta in reverse
 */
export function removeAxisDelta(
	axis: Axis,
	translate: number = 0,
	scale: number = 1,
	origin: number = 0.5,
	boxScale?: number,
	originAxis: Axis = axis,
	sourceAxis?: Axis
): void {
	// Support translation as a percentage
	if (typeof translate === 'string') {
		translate = parseFloat(translate);
		const sourceLength = sourceAxis ? sourceAxis.max - sourceAxis.min : 0;
		if (translate.toString().includes('%')) {
			translate = (sourceLength / 100) * translate;
		}
	}

	if (typeof translate !== 'number') return;

	let originPoint = mixNumber(originAxis.min, originAxis.max, origin);

	if (axis === originAxis) originPoint -= translate;

	axis.min = removePointDelta(axis.min, translate, scale, originPoint, boxScale);
	axis.max = removePointDelta(axis.max, translate, scale, originPoint, boxScale);
}

/**
 * The names of the motion values we want to apply as translation, scale and origin.
 */
const xKeys = ['x', 'scaleX', 'originX'];
const yKeys = ['y', 'scaleY', 'originY'];

/**
 * Remove a transforms from an axis. This is essentially the steps of applyAxisTransforms in reverse
 * and acts as a bridge between motion values and removeAxisDelta
 */
export function removeAxisTransforms(axis: Axis, transforms: ResolvedValues, [key, scaleKey, originKey]: string[]): void {
	removeAxisDelta(
		axis,
		transforms[key] as number,
		transforms[scaleKey] as number,
		transforms[originKey] as number,
		transforms.scale as number
	);
}

/**
 * Remove a transforms from a box. This is essentially the steps of applyBoxTransforms in reverse
 * and acts as a bridge between motion values and removeAxisDelta
 */
export function removeBoxTransforms(box: Box, transforms: ResolvedValues): void {
	removeAxisTransforms(box.x, transforms, xKeys);
	removeAxisTransforms(box.y, transforms, yKeys);
}
