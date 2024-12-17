import { createRenderBatcher } from './batcher.svelte';

export const { schedule: microtask, cancel: cancelMicrotask } = createRenderBatcher(queueMicrotask, false);
