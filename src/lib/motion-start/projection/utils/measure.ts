/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Box, TransformPoint } from '../geometry/types.js';
import { convertBoundingBoxToBox, transformBoxPoints } from '../geometry/conversion.js';

/**
 * Measure and return the element bounding box.
 *
 * We convert the box into a Box to make it easier to work with each axis
 * individually and programmatically.
 *
 * This function optionally accepts a transformPagePoint function which allows us to compensate
 * for, for instance, measuring the element within a scaled plane like a Framer device preview component.
 */
export function getBoundingBox(element: Element, transformPagePoint?: TransformPoint): Box {
	const box = element.getBoundingClientRect();
	return convertBoundingBoxToBox(transformBoxPoints(box, transformPagePoint));
}
