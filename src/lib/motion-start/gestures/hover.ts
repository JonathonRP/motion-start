/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { EventInfo } from '../events/types';
import { frame } from '../frameloop';
import { Feature } from '../motion/features/Feature';
import { isDragActive } from './drag/utils/lock';

export class HoverGesture extends Feature<Element> {
	mount() {
		this.registerHandler('onpointerenter', (event) => {
			const e = event as PointerEvent;
			if (e.pointerType === 'touch' || isDragActive()) return;
			const props = this.node.getProps();
			if (this.node.animationState && props.whileHover) {
				this.node.animationState.setActive('whileHover', true);
			}
			if (props.onHoverStart) {
				frame.postRender(() => props.onHoverStart?.(e, { point: { x: e.clientX, y: e.clientY } } as EventInfo));
			}
		});

		this.registerHandler('onpointerleave', (event) => {
			const e = event as PointerEvent;
			if (e.pointerType === 'touch' || isDragActive()) return;
			const props = this.node.getProps();
			if (this.node.animationState && props.whileHover) {
				this.node.animationState.setActive('whileHover', false);
			}
			if (props.onHoverEnd) {
				frame.postRender(() => props.onHoverEnd?.(e, { point: { x: e.clientX, y: e.clientY } } as EventInfo));
			}
		});
	}

	unmount() {
		this.removeHandler('onpointerenter');
		this.removeHandler('onpointerleave');
	}
}
