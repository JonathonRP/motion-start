/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Axis, AxisBox2D, BoxDelta, Point2D } from '../../types/geometry';
import type { ResolvedValues, VisualElement } from '../../render/types';

/** 
based on framer-motion@4.1.15,
Copyright (c) 2018 Framer B.V.
*/
import { fixed } from '../fix-process-env.js';
import { mix } from 'popmotion';
import { isDraggable } from '../../render/utils/is-draggable.js';

/**
 * Reset an axis to the provided origin box.
 *
 * This is a mutative operation.
 */
function resetAxis(axis: Axis, originAxis: Axis) {
	axis.min = originAxis.min;
	axis.max = originAxis.max;
}
/**
 * Reset a box to the provided origin box.
 *
 * This is a mutative operation.
 */
function resetBox(box: AxisBox2D, originBox: AxisBox2D) {
	resetAxis(box.x, originBox.x);
	resetAxis(box.y, originBox.y);
}
/**
 * Scales a point based on a factor and an originPoint
 */
function scalePoint(point: number, scale: number, originPoint: number) {
	var distanceFromOrigin = point - originPoint;
	var scaled = scale * distanceFromOrigin;
	return originPoint + scaled;
}
/**
 * Applies a translate/scale delta to a point
 */
function applyPointDelta(point: number, translate: number, scale: number, originPoint: number, boxScale?: number) {
	if (boxScale !== undefined) {
		point = scalePoint(point, boxScale, originPoint);
	}
	return scalePoint(point, scale, originPoint) + translate;
}
/**
 * Applies a translate/scale delta to an axis
 */
function applyAxisDelta(
	axis: Axis,
	translate: number | undefined,
	scale: number | undefined,
	originPoint: number,
	boxScale?: number
) {
	if (translate === void 0) {
		translate = 0;
	}
	if (scale === void 0) {
		scale = 1;
	}
	axis.min = applyPointDelta(axis.min, translate, scale, originPoint, boxScale);
	axis.max = applyPointDelta(axis.max, translate, scale, originPoint, boxScale);
}
/**
 * Applies a translate/scale delta to a box
 */
function applyBoxDelta(box: AxisBox2D, { x, y }: BoxDelta) {
	applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
	applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}
/**
 * Apply a transform to an axis from the latest resolved motion values.
 * This function basically acts as a bridge between a flat motion value map
 * and applyAxisDelta
 */
function applyAxisTransforms(
	final: Axis,
	axis: Axis,
	transforms: ResolvedValues,
	[key, scaleKey, originKey]: string[]
) {
	// Copy the current axis to the final axis before mutation
	final.min = axis.min;
	final.max = axis.max;
	var axisOrigin = transforms[originKey] !== undefined ? transforms[originKey] : 0.5;
	var originPoint = mix(axis.min, axis.max, axisOrigin as number);
	// Apply the axis delta to the final axis
	//@ts-ignore
	applyAxisDelta(final, transforms[key], transforms[scaleKey], originPoint, transforms.scale);
}
/**
 * The names of the motion values we want to apply as translation, scale and origin.
 */
var xKeys = ['x', 'scaleX', 'originX'];
var yKeys = ['y', 'scaleY', 'originY'];
/**
 * Apply a transform to a box from the latest resolved motion values.
 */
function applyBoxTransforms(finalBox: AxisBox2D, box: AxisBox2D, transforms: ResolvedValues) {
	applyAxisTransforms(finalBox.x, box.x, transforms, xKeys);
	applyAxisTransforms(finalBox.y, box.y, transforms, yKeys);
}
/**
 * Remove a delta from a point. This is essentially the steps of applyPointDelta in reverse
 */
function removePointDelta(point: number, translate: number, scale: number, originPoint: number, boxScale?: number) {
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
function removeAxisDelta(axis: Axis, translate?: number, scale?: number, origin?: number, boxScale?: number) {
	if (translate === void 0) {
		translate = 0;
	}
	if (scale === void 0) {
		scale = 1;
	}
	if (origin === void 0) {
		origin = 0.5;
	}
	var originPoint = mix(axis.min, axis.max, origin) - translate;
	axis.min = removePointDelta(axis.min, translate, scale, originPoint, boxScale);
	axis.max = removePointDelta(axis.max, translate, scale, originPoint, boxScale);
}
/**
 * Remove a transforms from an axis. This is essentially the steps of applyAxisTransforms in reverse
 * and acts as a bridge between motion values and removeAxisDelta
 */
function removeAxisTransforms(axis: Axis, transforms: ResolvedValues, [key, scaleKey, originKey]: string[]) {
	//@ts-ignore
	removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale);
}
/**
 * Remove a transforms from an box. This is essentially the steps of applyAxisBox in reverse
 * and acts as a bridge between motion values and removeAxisDelta
 */
function removeBoxTransforms(box: AxisBox2D, transforms: ResolvedValues) {
	removeAxisTransforms(box.x, transforms, xKeys);
	removeAxisTransforms(box.y, transforms, yKeys);
}
/**
 * Apply a tree of deltas to a box. We do this to calculate the effect of all the transforms
 * in a tree upon our box before then calculating how to project it into our desired viewport-relative box
 *
 * This is the final nested loop within updateLayoutDelta for future refactoring
 */
function applyTreeDeltas(box: AxisBox2D, treeScale: Point2D, treePath: VisualElement[]) {
	var treeLength = treePath.length;
	if (!treeLength) return;
	// Reset the treeScale
	treeScale.x = treeScale.y = 1;
	var node;
	var delta;
	for (var i = 0; i < treeLength; i++) {
		node = treePath[i];
		delta = node.getLayoutState().delta;
		// Incoporate each ancestor's scale into a culmulative treeScale for this component
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

export {
	applyAxisDelta,
	applyAxisTransforms,
	applyBoxDelta,
	applyBoxTransforms,
	applyPointDelta,
	applyTreeDeltas,
	removeAxisDelta,
	removeAxisTransforms,
	removeBoxTransforms,
	removePointDelta,
	resetAxis,
	resetBox,
	scalePoint,
};
