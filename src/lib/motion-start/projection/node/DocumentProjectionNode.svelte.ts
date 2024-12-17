/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createProjectionNode } from './create-projection-node.svelte';
import { addDomEvent } from '../../events/add-dom-event.svelte';

export const DocumentProjectionNode = createProjectionNode<Window>({
	attachResizeListener: (ref: Window | Element, notify: VoidFunction): VoidFunction =>
		addDomEvent(ref, 'resize', notify),
	measureScroll: () => ({
		x: document.documentElement.scrollLeft || document.body.scrollLeft,
		y: document.documentElement.scrollTop || document.body.scrollTop,
	}),
	checkIsScrollRoot: () => true,
});
