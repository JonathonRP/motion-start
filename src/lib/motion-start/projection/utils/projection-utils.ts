/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { frame } from '../../frameloop/index.js';
import type { VisualElement } from '../../render/types.js';
import { compareByDepth } from '../../render/utils/compare-by-depth.js';
import { copyBoxInto } from '../geometry/copy.js';

function isProjecting(visualElement: VisualElement): boolean {
	const isEnabled = visualElement.projection.isEnabled;
	return isEnabled || visualElement.shouldResetTransform();
}

export function collectProjectingAncestors(visualElement: VisualElement, ancestors: VisualElement[] = []): VisualElement[] {
	const parent = visualElement.parent;

	if (parent) collectProjectingAncestors(parent, ancestors);

	if (isProjecting(visualElement)) ancestors.push(visualElement);

	return ancestors;
}

export function collectProjectingChildren(visualElement: VisualElement): VisualElement[] {
	const children: VisualElement[] = [];

	const addChild = (child: VisualElement) => {
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
export function updateLayoutMeasurement(visualElement: VisualElement): void {
	if (visualElement.shouldResetTransform()) return;

	const layoutState = visualElement.getLayoutState();

	(visualElement as any).notifyBeforeLayoutMeasure(layoutState.layout);

	layoutState.isHydrated = true;
	layoutState.layout = visualElement.measureViewportBox();
	layoutState.layoutCorrected = { ...layoutState.layout };
	copyBoxInto(layoutState.layoutCorrected, layoutState.layout);

	visualElement.notifyLayoutMeasure(layoutState.layout, visualElement.prevViewportBox || layoutState.layout);

	sync.update(() => visualElement.rebaseProjectionTarget());
}

/**
 * Record the viewport box as it was before an expected mutation/re-render
 */
export function snapshotViewportBox(visualElement: VisualElement, nc?: any): void {
	if (visualElement.shouldResetTransform()) return;

	if (!nc) visualElement.prevViewportBox = visualElement.measureViewportBox(false);

	/**
	 * Update targetBox to match the prevViewportBox. This is just to ensure
	 * that targetBox is affected by scroll in the same way as the measured box
	 */
	visualElement.rebaseProjectionTarget(false, visualElement.prevViewportBox);
}
