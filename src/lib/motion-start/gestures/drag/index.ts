/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { Feature } from '../../motion/features/Feature';
import type { VisualElement } from '../../render/VisualElement.svelte';
import { noop } from '../../utils/noop';
// import { Gesture } from '../Gesture';
import { VisualElementDragControls } from './VisualElementDragControls';

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
		const { dragControls } = this.node.getProps();

		if (dragControls) {
			this.removeGroupControls = dragControls.subscribe(this.controls);
		}

		this.listen('pointerdown', (event) => {
			const { drag, dragListener = true } = this.controls.getProps();
			drag && dragListener && this.controls.start(event as PointerEvent);
		});

		this.removeListeners = this.controls.addListeners() || noop;

		// If a reparent snapshot is pending, resume the drag gesture on this new element.
		if (dragControls?.pendingResume) {
			const { lastPointerEvent, cursorProgress } = dragControls.pendingResume;
			dragControls.pendingResume = null;
			// Defer until after projection layout is measured (next microtask).
			Promise.resolve().then(() => {
				this.controls.start(lastPointerEvent, { cursorProgress });
			});
		}
	}

	unmount() {
		// If this element is currently being dragged, save a snapshot so the next
		// element with the same DragControls can resume the gesture (reparenting).
		const { dragControls } = this.node.getProps();
		if (dragControls && this.controls.isDragging && this.controls.lastPointerEvent) {
			dragControls.pendingResume = {
				lastPointerEvent: this.controls.lastPointerEvent,
				cursorProgress: { ...this.controls.cursorProgress },
			};
			// End the PanSession so its window listeners don't conflict with the
			// new element's PanSession, but don't call cancel() so isDragging stays
			// true (snapshot was just saved above) and the global drag lock is kept
			// until the new element's start() acquires it.
			this.controls.endPanSession();
		}

		this.removeGroupControls();
		this.removeListeners();
		super.unmount();
	}
}
