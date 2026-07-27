import { noop } from '../utils/noop.js';
import { createRenderBatcher } from './batcher.js';

export const {
	schedule: frame,
	cancel: cancelFrame,
	state: frameData,
	steps: frameSteps,
} = createRenderBatcher(
	typeof requestAnimationFrame !== 'undefined'
		? (callback: Function) => {
				requestAnimationFrame(callback as FrameRequestCallback);
			}
		: noop,
	true
);
