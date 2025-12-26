/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../../render/types.js';
import { calcRelativeOffset } from '../../motion/features/layout/utils.js';
import { eachAxis } from '../../utils/each-axis.js';

export function setCurrentViewportBox(visualElement: VisualElement): void {
	const projectionParent = visualElement.getProjectionParent();

	if (!projectionParent) {
		visualElement.rebaseProjectionTarget();
		return;
	}

	const relativeOffset = calcRelativeOffset(
		projectionParent.getLayoutState().layout,
		visualElement.getLayoutState().layout
	);

	eachAxis((axis) => {
		visualElement.setProjectionTargetAxis(axis, relativeOffset[axis].min, relativeOffset[axis].max, true);
	});
}
