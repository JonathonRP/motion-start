/**
 * Frame Loop Entry Point
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Sets up the main frameloop using requestAnimationFrame (or fallback to noop).
 * This is the primary animation frame scheduler used by the motion system.
 */

import { createRenderBatcher } from './batcher.js';

/**
 * Get requestAnimationFrame if available, otherwise use noop
 * This ensures SSR compatibility
 */
const requestAnimationFrameImpl: (callback: FrameRequestCallback) => number =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: (() => 0) as any;

/**
 * Create the main frameloop batcher
 * - Uses requestAnimationFrame for scheduling
 * - Allows keepAlive (true) for persistent animations
 */
const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = createRenderBatcher(
	requestAnimationFrameImpl,
	true
);

/**
 * Export the frameloop interface
 */
export { frame, cancelFrame, frameData, frameSteps };
