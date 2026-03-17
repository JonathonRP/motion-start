/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { Feature } from '../../motion/features/Feature';
import { resolveVariantFromProps } from '../../render/utils/resolve-variants';
import type { VisualElement } from '../../render/VisualElement.svelte';
import { noop } from '../../utils/noop';
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
		// DragGesture.mount() fires inside a $effect.pre that guards on visualElement.current,
		// so the DOM element IS attached here — we can measure synchronously.
		if (dragControls?.pendingResume) {
			const { lastPointerEvent, cursorProgress } = dragControls.pendingResume;
			dragControls.pendingResume = null;

			// Block FLIP layout animation synchronously — projection's queueMicrotask
			// fires after this synchronous code so isAnimationBlocked=true will be seen.
			if (this.node.projection) {
				this.node.projection.isAnimationBlocked = true;
				this.node.projection.target = undefined;
			}

			// Apply whileDrag styles synchronously before the first paint so there's
			// no single-frame flash of the card without drag styling.
			this.node.animationState?.setActive('whileDrag', true);

			// Instantly set whileDrag target values on MotionValues so the first paint
			// already shows the correct drag styles — setActive() starts an animation
			// (async) so without this there's a single-frame flash of un-styled card.
			const { whileDrag } = this.node.getProps();
			if (whileDrag && !Array.isArray(whileDrag)) {
				const resolved = resolveVariantFromProps(this.node.getProps(), whileDrag);
				if (resolved) {
					const { transition: _t, transitionEnd: _te, ...target } = resolved;
					for (const key in target) {
						const mv = this.node.getValue(key) as { set(v: unknown): void } | undefined;
						mv?.set(target[key as keyof typeof target]);
					}
					this.node.render();
				}
			}

			// Measure element position now (DOM is attached) and compute exact x/y so
			// the card snaps to the cursor on first paint with no flicker.
			this.controls.applyReparentPosition(lastPointerEvent, cursorProgress);

			// Resume the drag session on this new element. start() is synchronous here
			// (DOM is ready) — PanSession adds pointermove/pointerup listeners immediately
			// so there's no gap where pointer-up can be missed.
			this.controls.start(lastPointerEvent, { cursorProgress });
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
