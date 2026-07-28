import { noop } from '../utils/noop.js';
import { createRenderBatcher } from './batcher.js';

export const { schedule: microtask, cancel: cancelMicrotask } = createRenderBatcher(
	typeof queueMicrotask !== 'undefined' ? (callback: Function) => queueMicrotask(callback as VoidFunction) : noop,
	false
);
