import { noop } from '../utils/noop';
import { createRenderBatcher } from './batcher';

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
