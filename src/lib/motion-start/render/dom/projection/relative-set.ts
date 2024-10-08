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

function setCurrentViewportBox(visualElement: VisualElement) {
    var projectionParent = visualElement.getProjectionParent();
    if (!projectionParent) {
        visualElement.rebaseProjectionTarget();
        return;
    }
    var relativeOffset = calcRelativeOffset(projectionParent.getLayoutState().layout, visualElement.getLayoutState().layout);
    eachAxis(function (axis) {
        visualElement.setProjectionTargetAxis(axis, relativeOffset[axis].min, relativeOffset[axis].max, true);
    });
}

export { setCurrentViewportBox };
