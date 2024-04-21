/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { BoundingBox2D, TransformPoint2D, AxisBox2D, Axis, BoxDelta } from "../../types/geometry";

/**
 * Calculate the center point of the provided axis
 */
export declare function calcAxisCenter({ min, max }: Axis): number;

/** 
based on framer-motion@4.1.15,
Copyright (c) 2018 Framer B.V.
*/
import { __assign } from 'tslib';
import { noop } from '../noop.js';

/**
 * Bounding boxes tend to be defined as top, left, right, bottom. For various operations
 * it's easier to consider each axis individually. This function returns a bounding box
 * as a map of single-axis min/max values.
 */
function convertBoundingBoxToAxisBox({ top, left, right, bottom, }: BoundingBox2D) {
    return {
        x: { min: left, max: right },
        y: { min: top, max: bottom },
    } as AxisBox2D;
}
function convertAxisBoxToBoundingBox({ x, y, }: AxisBox2D) {
    return {
        top: y.min,
        bottom: y.max,
        left: x.min,
        right: x.max,
    } as BoundingBox2D;
}
/**
 * Applies a TransformPoint function to a bounding box. TransformPoint is usually a function
 * provided by Framer to allow measured points to be corrected for device scaling. This is used
 * when measuring DOM elements and DOM event points.
 */
function transformBoundingBox({ top, left, bottom, right }: BoundingBox2D, transformPoint?: TransformPoint2D): BoundingBox2D {
    if (transformPoint === void 0) { transformPoint = noop; }
    var topLeft = transformPoint({ x: left, y: top });
    var bottomRight = transformPoint({ x: right, y: bottom });
    return {
        top: topLeft.y,
        left: topLeft.x,
        bottom: bottomRight.y,
        right: bottomRight.x,
    };
}
/**
 * Create an empty axis box of zero size
 */
function axisBox(): AxisBox2D {
    return { x: { min: 0, max: 1 }, y: { min: 0, max: 1 } };
}
function copyAxisBox(box: AxisBox2D): AxisBox2D {
    return {
        x: __assign({}, box.x),
        y: __assign({}, box.y),
    };
}
/**
 * Create an empty box delta
 */
var zeroDelta = {
    translate: 0,
    scale: 1,
    origin: 0,
    originPoint: 0,
};
function delta(): BoxDelta {
    return {
        x: __assign({}, zeroDelta),
        y: __assign({}, zeroDelta),
    };
}

export { axisBox, convertAxisBoxToBoundingBox, convertBoundingBoxToAxisBox, copyAxisBox, delta, transformBoundingBox };
