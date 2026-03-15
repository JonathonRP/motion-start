/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { type PanInfo, PanSession } from './PanSession';
import { Feature } from '../../motion/features/Feature';
import { noop } from '../../utils/noop';
import { getContextWindow } from '../../utils/get-context-window';
import { frame } from '../../frameloop';

type PanEventHandler = (event: PointerEvent, info: PanInfo) => void;
const asyncHandler = (handler?: PanEventHandler) => (event: PointerEvent, info: PanInfo) => {
	if (handler) {
		frame.postRender(() => handler(event, info));
	}
};

export class PanGesture extends Feature<Element> {
	private session?: PanSession;

	private removePointerDownListener: Function = noop;

	onPointerDown(pointerDownEvent: PointerEvent) {
		this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
			transformPagePoint: this.node.getTransformPagePoint(),
			contextWindow: getContextWindow(this.node),
		});
	}

	createPanHandlers() {
		const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();

		return {
			onSessionStart: asyncHandler(onPanSessionStart),
			onStart: asyncHandler(onPanStart),
			onMove: onPan,
			onEnd: (event: PointerEvent, info: PanInfo) => {
				delete this.session;
				if (onPanEnd) {
					frame.postRender(() => onPanEnd(event, info));
				}
			},
		};
	}

	mount() {
		this.registerHandler('onpointerdown', (event) => this.onPointerDown(event as PointerEvent));
	}

	update() {
		this.session && this.session.updateHandlers(this.createPanHandlers());
	}

	unmount() {
		this.removePointerDownListener();
		this.removeHandler('onpointerdown');
		this.session && this.session.end();
	}
}
