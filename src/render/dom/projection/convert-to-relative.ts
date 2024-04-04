/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { VisualElement } from "../../types";
/**
 * Returns a boolean stating whether or not we converted the projection
 * to relative projection.
 */
export declare function convertToRelativeProjection(visualElement: VisualElement, isLayoutDrag?: boolean): boolean;


/** 
based on framer-motion@4.1.11,
Copyright (c) 2018 Framer B.V.
*/

import { calcRelativeOffset } from '../../../motion/features/layout/utils.js';
import { eachAxis } from '../../../utils/each-axis.js';
import { removeBoxTransforms } from '../../../utils/geometry/delta-apply.js';

/**
 * Returns a boolean stating whether or not we converted the projection
 * to relative projection.
 */
function convertToRelativeProjection(visualElement, isLayoutDrag) {
    if (isLayoutDrag === void 0) { isLayoutDrag = true; }
    var projectionParent = visualElement.getProjectionParent();
    if (!projectionParent)
        return false;
    var offset;
    if (isLayoutDrag) {
        offset = calcRelativeOffset(projectionParent.projection.target, visualElement.projection.target);
        removeBoxTransforms(offset, projectionParent.getLatestValues());
    }
    else {
        offset = calcRelativeOffset(projectionParent.getLayoutState().layout, visualElement.getLayoutState().layout);
    }
    eachAxis(function (axis) {
        return visualElement.setProjectionTargetAxis(axis, offset[axis].min, offset[axis].max, true);
    });
    return true;
}

export { convertToRelativeProjection };
