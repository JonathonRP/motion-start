/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VisualElement } from "../../types";


/** 
based on framer-motion@4.1.11,
Copyright (c) 2018 Framer B.V.
*/

import { calcRelativeOffset } from '../../../motion/features/layout/utils.js';
import { eachAxis } from '../../../utils/each-axis.js';
import { removeBoxTransforms } from '../../../utils/geometry/delta-apply.js';
import type { AxisBox2D } from "$lib/motion-start/types/geometry";

/**
 * Returns a boolean stating whether or not we converted the projection
 * to relative projection.
 */
function convertToRelativeProjection(visualElement: VisualElement, isLayoutDrag?: boolean) {
    if (isLayoutDrag === void 0) { isLayoutDrag = true; }
    var projectionParent = visualElement.getProjectionParent();
    if (!projectionParent)
        return false;
    var offset: AxisBox2D;
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
