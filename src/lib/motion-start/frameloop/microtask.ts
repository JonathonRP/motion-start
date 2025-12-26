/**
 * Microtask Batcher
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Creates a microtask-based batcher for operations that need to run
 * before the next frame but after the current synchronous execution.
 * This is useful for batching state updates or other operations that
 * should complete before visual updates.
 */

import { createRenderBatcher } from './batcher.js';

/**
 * Create a microtask batcher
 * - Uses queueMicrotask for scheduling (runs before next frame)
 * - Does not allow keepAlive (false) since microtasks are one-shot
 */
const { schedule: microtask, cancel: cancelMicrotask } = createRenderBatcher(
	queueMicrotask as (callback: VoidFunction) => void,
	false
);

/**
 * Export microtask batching interface
 */
export { microtask, cancelMicrotask };
