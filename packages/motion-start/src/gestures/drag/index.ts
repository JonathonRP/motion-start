/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { Feature } from '../../motion/features/Feature.js';
import type { VisualElement } from '../../render/VisualElement.svelte.js';
import { noop } from '../../utils/noop.js';
import { activeLayoutIdDrags, VisualElementDragControls } from './VisualElementDragControls.js';

export class DragGesture extends Feature<HTMLElement> {
	controls: VisualElementDragControls;

	removeGroupControls: Function = noop;
	removeListeners: Function = noop;

	constructor(node: VisualElement<HTMLElement>) {
		super(node);
		this.controls = new VisualElementDragControls(node);
	}

	mount() {
		// If we've been provided a DragControls for manual control over the drag gesture,
		// subscribe this component to it on mount.
		const { drag, dragControls, layoutId } = this.node.getProps();

		if (dragControls) {
			this.removeGroupControls = dragControls.subscribe(this.controls);
		}

		/**
		 * If a same-`layoutId` element elsewhere is mid-drag (e.g. this is the
		 * copy a `Reorder.Item` is being conditionally reparented into, while
		 * the pointer that started the drag is still down), adopt that
		 * still-running gesture instead of waiting for a pointerdown that will
		 * never come on this newly-mounted element.
		 */
		if (drag && typeof layoutId === 'string') {
			const handoff = activeLayoutIdDrags.get(layoutId);
			if (handoff && handoff !== this.controls) {
				if (!this.controls.adopt(handoff) && activeLayoutIdDrags.get(layoutId) === handoff) {
					activeLayoutIdDrags.delete(layoutId);
				}
			}
		}

		this.listen('pointerdown', (event) => {
			const { drag, dragListener = true } = this.controls.getProps();
			drag && dragListener && this.controls.start(event as PointerEvent);
		});

		this.removeListeners = this.controls.addListeners() || noop;
	}

	unmount() {
		this.removeGroupControls();
		this.removeListeners();
		this.controls.cancelIfHandoffMissed();
		super.unmount();
	}
}
