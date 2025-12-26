/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import { calcRelativeOffset } from '../../../motion/features/layout/utils.js';
import { eachAxis } from '../../../utils/each-axis.js';
import type { VisualElement } from '../../types';

function setCurrentViewportBox(visualElement: VisualElement) {
	var projectionParent = visualElement.getProjectionParent();
	if (!projectionParent) {
		visualElement.rebaseProjectionTarget();
		return;
	}
	var relativeOffset = calcRelativeOffset(
		projectionParent.getLayoutState().layout,
		visualElement.getLayoutState().layout
	);
	eachAxis((axis) => {
		visualElement.setProjectionTargetAxis(axis, relativeOffset[axis].min, relativeOffset[axis].max, true);
	});
}

export { setCurrentViewportBox };
