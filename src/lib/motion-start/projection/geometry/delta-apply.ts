/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { mix } from '../../utils/mix/index.js';
import type { ResolvedValues, VisualElement } from '../../render/types.js';
import { isDraggable } from '../../render/utils/is-draggable.js';
import type { Axis, Box, Delta, Point } from './types.js';

/**
 * Scales a point based on a factor and an originPoint
 */
export function scalePoint(point: number, scale: number, originPoint: number): number {
	const distanceFromOrigin = point - originPoint;
	const scaled = scale * distanceFromOrigin;
	return originPoint + scaled;
}

/**
 * Applies a translate/scale delta to a point
 */
export function applyPointDelta(
	point: number,
	translate: number,
	scale: number,
	originPoint: number,
	boxScale?: number
): number {
	if (boxScale !== undefined) {
		point = scalePoint(point, boxScale, originPoint);
	}
	return scalePoint(point, scale, originPoint) + translate;
}

/**
 * Applies a translate/scale delta to an axis
 */
export function applyAxisDelta(
	axis: Axis,
	translate: number = 0,
	scale: number = 1,
	originPoint: number,
	boxScale?: number
): void {
	axis.min = applyPointDelta(axis.min, translate, scale, originPoint, boxScale);
	axis.max = applyPointDelta(axis.max, translate, scale, originPoint, boxScale);
}

/**
 * Applies a translate/scale delta to a box
 */
export function applyBoxDelta(box: Box, { x, y }: Delta): void {
	applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
	applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}

/**
 * Apply a transform to an axis from the latest resolved motion values.
 * This function basically acts as a bridge between a flat motion value map
 * and applyAxisDelta
 */
export function applyAxisTransforms(final: Axis, axis: Axis, transforms: ResolvedValues, [key, scaleKey, originKey]: string[]): void {
	// Copy the current axis to the final axis before mutation
	final.min = axis.min;
	final.max = axis.max;

	const axisOrigin = transforms[originKey] !== undefined ? transforms[originKey] : 0.5;
	const originPoint = mix(axis.min, axis.max, axisOrigin as number);

	// Apply the axis delta to the final axis
	applyAxisDelta(final, transforms[key] as number, transforms[scaleKey] as number, originPoint, transforms.scale as number);
}

/**
 * The names of the motion values we want to apply as translation, scale and origin.
 */
const xKeys = ['x', 'scaleX', 'originX'];
const yKeys = ['y', 'scaleY', 'originY'];

/**
 * Apply a transform to a box from the latest resolved motion values.
 */
export function applyBoxTransforms(finalBox: Box, box: Box, transforms: ResolvedValues): void {
	applyAxisTransforms(finalBox.x, box.x, transforms, xKeys);
	applyAxisTransforms(finalBox.y, box.y, transforms, yKeys);
}

/**
 * Apply a tree of deltas to a box. We do this to calculate the effect of all the transforms
 * in a tree upon our box before then calculating how to project it into our desired viewport-relative box
 *
 * This is the final nested loop within updateLayoutDelta for future refactoring
 */
export function applyTreeDeltas(box: Box, treeScale: Point, treePath: VisualElement[]): void {
	const treeLength = treePath.length;
	if (!treeLength) return;

	// Reset the treeScale
	treeScale.x = treeScale.y = 1;

	let node: VisualElement;
	let delta: Delta;

	for (let i = 0; i < treeLength; i++) {
		node = treePath[i];
		delta = node.getLayoutState().delta;

		// Incorporate each ancestor's scale into a cumulative treeScale for this component
		treeScale.x *= delta.x.scale;
		treeScale.y *= delta.y.scale;

		// Apply each ancestor's calculated delta into this component's recorded layout box
		applyBoxDelta(box, delta);

		// If this is a draggable ancestor, also incorporate the node's transform to the layout box
		if (isDraggable(node)) {
			applyBoxTransforms(box, box, node.getLatestValues());
		}
	}
}
