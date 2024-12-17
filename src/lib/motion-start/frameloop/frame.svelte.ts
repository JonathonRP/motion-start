import { noop } from '../utils/noop';
import { createRenderBatcher } from './batcher.svelte';

export const {
	schedule: frame,
	cancel: cancelFrame,
	state: frameData,
	steps: frameSteps,
} = createRenderBatcher(typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : noop, true);
