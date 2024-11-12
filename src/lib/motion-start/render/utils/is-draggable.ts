/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../VisualElement';

export function isDraggable(visualElement: VisualElement) {
	const { drag, _dragX } = visualElement.getProps();
	return drag && !_dragX;
}
