/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../VisualElement.svelte';

export function isDraggable<I>(visualElement: VisualElement<I>) {
	const { drag, _dragX } = visualElement.getProps();
	return drag && !_dragX;
}
