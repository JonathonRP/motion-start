/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { BoundingBox, Box, TransformPoint } from './types.js';

/**
 * Bounding boxes tend to be defined as top, left, right, bottom. For various operations
 * it's easier to consider each axis individually. This function returns a bounding box
 * as a map of single-axis min/max values.
 */
export function convertBoundingBoxToBox({ top, left, right, bottom }: BoundingBox): Box {
	return {
		x: { min: left, max: right },
		y: { min: top, max: bottom },
	};
}

export function convertBoxToBoundingBox({ x, y }: Box): BoundingBox {
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
export function transformBoxPoints({ top, left, bottom, right }: BoundingBox, transformPoint?: TransformPoint): BoundingBox {
	const topLeft = transformPoint ? transformPoint({ x: left, y: top }) : { x: left, y: top };
	const bottomRight = transformPoint ? transformPoint({ x: right, y: bottom }) : { x: right, y: bottom };

	return {
		top: topLeft.y,
		left: topLeft.x,
		bottom: bottomRight.y,
		right: bottomRight.x,
	};
}
