/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { BoundingBox2D, TransformPoint2D, AxisBox2D, Axis, BoxDelta } from "../../types/geometry";
/**
 * Bounding boxes tend to be defined as top, left, right, bottom. For various operations
 * it's easier to consider each axis individually. This function returns a bounding box
 * as a map of single-axis min/max values.
 */
export declare function convertBoundingBoxToAxisBox({ top, left, right, bottom, }: BoundingBox2D): AxisBox2D;
export declare function convertAxisBoxToBoundingBox({ x, y, }: AxisBox2D): BoundingBox2D;
/**
 * Applies a TransformPoint function to a bounding box. TransformPoint is usually a function
 * provided by Framer to allow measured points to be corrected for device scaling. This is used
 * when measuring DOM elements and DOM event points.
 */
export declare function transformBoundingBox({ top, left, bottom, right }: BoundingBox2D, transformPoint?: TransformPoint2D): BoundingBox2D;
/**
 * Calculate the center point of the provided axis
 */
export declare function calcAxisCenter({ min, max }: Axis): number;
/**
 * Create an empty axis box of zero size
 */
export declare function axisBox(): AxisBox2D;
export declare function copyAxisBox(box: AxisBox2D): AxisBox2D;
export declare function delta(): BoxDelta;

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
function convertBoundingBoxToAxisBox(_a) {
    var top = _a.top, left = _a.left, right = _a.right, bottom = _a.bottom;
    return {
        x: { min: left, max: right },
        y: { min: top, max: bottom },
    };
}
function convertAxisBoxToBoundingBox(_a) {
    var x = _a.x, y = _a.y;
    return {
        top: y.min,
        bottom: y.max,
        left: x.min,
        right: x.max,
    };
}
/**
 * Applies a TransformPoint function to a bounding box. TransformPoint is usually a function
 * provided by Framer to allow measured points to be corrected for device scaling. This is used
 * when measuring DOM elements and DOM event points.
 */
function transformBoundingBox(_a, transformPoint) {
    var top = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right;
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
function axisBox() {
    return { x: { min: 0, max: 1 }, y: { min: 0, max: 1 } };
}
function copyAxisBox(box) {
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
function delta() {
    return {
        x: __assign({}, zeroDelta),
        y: __assign({}, zeroDelta),
    };
}

export { axisBox, convertAxisBoxToBoundingBox, convertBoundingBoxToAxisBox, copyAxisBox, delta, transformBoundingBox };
