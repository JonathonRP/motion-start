import { noop } from '../utils/noop';
import { createRenderBatcher } from './batcher';

export const { schedule: microtask, cancel: cancelMicrotask } = createRenderBatcher(
	typeof queueMicrotask !== 'undefined' ? (callback: Function) => queueMicrotask(callback as VoidFunction) : noop,
	false
);
