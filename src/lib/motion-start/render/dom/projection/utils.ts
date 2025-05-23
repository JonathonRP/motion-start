/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VisualElement } from '../../types';

/** 
based on framer-motion@4.1.11,
Copyright (c) 2018 Framer B.V.
*/

import sync from 'framesync';
import { copyAxisBox } from '../../../utils/geometry/index.js';
import { compareByDepth } from '../../utils/compare-by-depth.js';

function isProjecting(visualElement: VisualElement) {
	var isEnabled = visualElement.projection.isEnabled;
	return isEnabled || visualElement.shouldResetTransform();
}
function collectProjectingAncestors(visualElement: VisualElement, ancestors?: VisualElement[]) {
	if (ancestors === void 0) {
		ancestors = [];
	}
	var parent = visualElement.parent;
	if (parent) collectProjectingAncestors(parent, ancestors);
	if (isProjecting(visualElement)) ancestors.push(visualElement);
	return ancestors;
}
function collectProjectingChildren(visualElement: VisualElement) {
	var children = <VisualElement[]>[];
	var addChild = (child: VisualElement) => {
		if (isProjecting(child)) children.push(child);
		child.children.forEach(addChild);
	};
	visualElement.children.forEach(addChild);
	return children.sort(compareByDepth);
}
/**
 * Update the layoutState by measuring the DOM layout. This
 * should be called after resetting any layout-affecting transforms.
 */
function updateLayoutMeasurement(visualElement: VisualElement) {
	if (visualElement.shouldResetTransform()) return;
	var layoutState = visualElement.getLayoutState();
	(visualElement as any).notifyBeforeLayoutMeasure(layoutState.layout);
	layoutState.isHydrated = true;
	layoutState.layout = visualElement.measureViewportBox();
	layoutState.layoutCorrected = copyAxisBox(layoutState.layout);
	visualElement.notifyLayoutMeasure(layoutState.layout, visualElement.prevViewportBox || layoutState.layout);
	sync.update(() => visualElement.rebaseProjectionTarget());
}
/**
 * Record the viewport box as it was before an expected mutation/re-render
 */
function snapshotViewportBox(visualElement: VisualElement, nc?: any) {
	if (visualElement.shouldResetTransform()) return;
	if (!nc) visualElement.prevViewportBox = visualElement.measureViewportBox(false);
	/**
	 * Update targetBox to match the prevViewportBox. This is just to ensure
	 * that targetBox is affected by scroll in the same way as the measured box
	 */
	visualElement.rebaseProjectionTarget(false, visualElement.prevViewportBox);
}

export { collectProjectingAncestors, collectProjectingChildren, snapshotViewportBox, updateLayoutMeasurement };
