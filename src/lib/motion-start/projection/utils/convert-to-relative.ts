/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../../render/types.js';
import { calcRelativeOffset } from '../../motion/features/layout/utils.js';
import { eachAxis } from '../../utils/each-axis.js';
import { removeBoxTransforms } from '../geometry/delta-remove.js';

/**
 * Returns a boolean stating whether or not we converted the projection
 * to relative projection.
 */
export function convertToRelativeProjection(visualElement: VisualElement, isLayoutDrag: boolean = true): boolean {
	const projectionParent = visualElement.getProjectionParent();

	if (!projectionParent) return false;

	let offset;

	if (isLayoutDrag) {
		offset = calcRelativeOffset(projectionParent.projection.target, visualElement.projection.target);
		removeBoxTransforms(offset, projectionParent.getLatestValues());
	} else {
		offset = calcRelativeOffset(projectionParent.getLayoutState().layout, visualElement.getLayoutState().layout);
	}

	eachAxis((axis) => visualElement.setProjectionTargetAxis(axis, offset[axis].min, offset[axis].max, true));

	return true;
}
