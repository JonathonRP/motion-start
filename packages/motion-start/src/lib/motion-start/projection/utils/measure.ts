/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { convertBoundingBoxToBox, transformBoxPoints } from '../geometry/conversion.js';
import { translateAxis } from '../geometry/delta-apply.js';
import type { TransformPoint } from '../geometry/types.js';
import type { IProjectionNode } from '../node/types.js';

export function measureViewportBox(instance: HTMLElement, transformPoint?: TransformPoint) {
	return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint));
}

export function measurePageBox(
	element: HTMLElement,
	rootProjectionNode: IProjectionNode<unknown>,
	transformPagePoint?: TransformPoint
) {
	const viewportBox = measureViewportBox(element, transformPagePoint);
	const { scroll } = rootProjectionNode;

	if (scroll) {
		translateAxis(viewportBox.x, scroll.offset.x);
		translateAxis(viewportBox.y, scroll.offset.y);
	}

	return viewportBox;
}
