/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Axis, AxisBox2D, BoundingBox2D, Point2D } from '../../../types/geometry';
import type { DragElastic, ResolvedConstraints } from '../types';

/**
 * Calculate the relative progress of one constraints box relative to another.
 * Imagine a page scroll bar. At the top, this would return 0, at the bottom, 1.
 * Anywhere in-between, a value between 0 and 1.
 *
 * This also handles flipped constraints, for instance a draggable container within
 * a smaller viewport like a scrollable view.
 */
export type calcProgressWithinConstraints = (layoutBox: AxisBox2D, constraintsBox: AxisBox2D) => Point2D;

/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { mix } from 'popmotion';

/**
 * Apply constraints to a point. These constraints are both physical along an
 * axis, and an elastic factor that determines how much to constrain the point
 * by if it does lie outside the defined parameters.
 */
function applyConstraints(point: number, { min, max }: Partial<Axis>, elastic?: Axis) {
	if (min !== undefined && point < min) {
		// If we have a min point defined, and this is outside of that, constrain
		point = elastic ? mix(min, point, elastic.min) : Math.max(point, min);
	} else if (max !== undefined && point > max) {
		// If we have a max point defined, and this is outside of that, constrain
		point = elastic ? mix(max, point, elastic.max) : Math.min(point, max);
	}
	return point;
}
/**
 * Calculates a min projection point based on a pointer, pointer progress
 * within the drag target, and constraints.
 *
 * For instance if an element was 100px width, we were dragging from 0.25
 * along this axis, the pointer is at 200px, and there were no constraints,
 * we would calculate a min projection point of 175px.
 */
function calcConstrainedMinPoint(
	point: number,
	length: number,
	progress: number,
	constraints?: Partial<Axis>,
	elastic?: Axis
) {
	// Calculate a min point for this axis and apply it to the current pointer
	var min = point - length * progress;
	return constraints ? applyConstraints(min, constraints, elastic) : min;
}
/**
 * Calculate constraints in terms of the viewport when defined relatively to the
 * measured axis. This is measured from the nearest edge, so a max constraint of 200
 * on an axis with a max value of 300 would return a constraint of 500 - axis length
 */
function calcRelativeAxisConstraints(axis: Axis, min?: number, max?: number) {
	return {
		min: min !== undefined ? axis.min + min : undefined,
		max: max !== undefined ? axis.max + max - (axis.max - axis.min) : undefined,
	} as Partial<Axis>;
}
/**
 * Calculate constraints in terms of the viewport when
 * defined relatively to the measured bounding box.
 */
function calcRelativeConstraints(layoutBox: AxisBox2D, { top, left, bottom, right }: Partial<BoundingBox2D>) {
	return {
		x: calcRelativeAxisConstraints(layoutBox.x, left, right),
		y: calcRelativeAxisConstraints(layoutBox.y, top, bottom),
	} as ResolvedConstraints;
}
/**
 * Calculate viewport constraints when defined as another viewport-relative axis
 */
function calcViewportAxisConstraints(layoutAxis: Axis, constraintsAxis: Axis) {
	var _a;
	var min = constraintsAxis.min - layoutAxis.min;
	var max = constraintsAxis.max - layoutAxis.max;
	// If the constraints axis is actually smaller than the layout axis then we can
	// flip the constraints
	if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) {
		_a = [max, min];
		[min, max] = _a;
	}
	return {
		min: layoutAxis.min + min,
		max: layoutAxis.min + max,
	};
}
/**
 * Calculate viewport constraints when defined as another viewport-relative box
 */
function calcViewportConstraints(layoutBox: AxisBox2D, constraintsBox: AxisBox2D) {
	return {
		x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
		y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y),
	};
}
/**
 * Calculate the an axis position based on two axes and a progress value.
 */
function calcPositionFromProgress(axis: Axis, constraints: Axis, progress: number) {
	var axisLength = axis.max - axis.min;
	var min = mix(constraints.min, constraints.max - axisLength, progress);
	return { min: min, max: min + axisLength } as Axis;
}
/**
 * Rebase the calculated viewport constraints relative to the layout.min point.
 */
function rebaseAxisConstraints(layout: Axis, constraints: Partial<Axis>) {
	var relativeConstraints: Partial<Axis> = {};
	if (constraints.min !== undefined) {
		relativeConstraints.min = constraints.min - layout.min;
	}
	if (constraints.max !== undefined) {
		relativeConstraints.max = constraints.max - layout.min;
	}
	return relativeConstraints;
}
const defaultElastic = 0.35;
/**
 * Accepts a dragElastic prop and returns resolved elastic values for each axis.
 */
function resolveDragElastic(dragElastic: DragElastic) {
	if (dragElastic === false) {
		dragElastic = 0;
	} else if (dragElastic === true) {
		dragElastic = defaultElastic;
	}
	return {
		x: resolveAxisElastic(dragElastic, 'left', 'right'),
		y: resolveAxisElastic(dragElastic, 'top', 'bottom'),
	} as AxisBox2D;
}
function resolveAxisElastic(dragElastic: DragElastic, minLabel: string, maxLabel: string) {
	return {
		min: resolvePointElastic(dragElastic, minLabel),
		max: resolvePointElastic(dragElastic, maxLabel),
	} as Axis;
}
function resolvePointElastic(dragElastic: DragElastic, label: string): number {
	var _a;
	return typeof dragElastic === 'number'
		? dragElastic
		: (_a = (dragElastic as any)[label]) !== null && _a !== void 0
			? _a
			: 0;
}

export {
	applyConstraints,
	calcConstrainedMinPoint,
	calcPositionFromProgress,
	calcRelativeAxisConstraints,
	calcRelativeConstraints,
	calcViewportAxisConstraints,
	calcViewportConstraints,
	defaultElastic,
	rebaseAxisConstraints,
	resolveAxisElastic,
	resolveDragElastic,
	resolvePointElastic,
};
