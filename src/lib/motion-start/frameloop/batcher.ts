/**
 * Render Batcher Implementation
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * The render batcher orchestrates the frameloop pipeline, processing callbacks
 * through six sequential stages: read, resolveKeyframes, update, preRender,
 * render, and postRender. This ensures proper batching and ordering of DOM
 * operations for optimal performance.
 */

import { MotionGlobalConfig } from '../utils/GlobalConfig.js';
import { createRenderStep } from './render-step.js';
import type { Batcher, Process, StepId, Steps, FrameData } from './types.js';

/**
 * Order of steps in the frameloop pipeline
 *
 * 1. read - Read from DOM (measurements, layouts)
 * 2. resolveKeyframes - Resolve dynamic keyframes (e.g., "auto" values)
 * 3. update - Update animation state
 * 4. preRender - Prepare values for rendering
 * 5. render - Apply changes to DOM
 * 6. postRender - Cleanup and post-processing
 */
export const stepsOrder: StepId[] = [
	'read',
	'resolveKeyframes',
	'update',
	'preRender',
	'render',
	'postRender',
];

/**
 * Maximum time delta to prevent huge jumps (e.g., tab switching)
 * Capped at 40ms to avoid spiral of death
 */
const maxElapsed = 40;

/**
 * Creates a render batcher that coordinates frameloop execution
 *
 * @param scheduleNextBatch - Function to schedule the next batch (e.g., requestAnimationFrame)
 * @param allowKeepAlive - Whether to allow keepAlive processes (false for microtask batching)
 * @returns Batcher interface with schedule, cancel, state, and steps
 */
export function createRenderBatcher(
	scheduleNextBatch: (callback: any) => any,
	allowKeepAlive: boolean
) {
	/**
	 * Flag to trigger the next frame
	 */
	let runNextFrame = false;

	/**
	 * Whether to use default elapsed time (60fps) for first frame
	 */
	let useDefaultElapsed = true;

	/**
	 * Frame state shared across all steps
	 */
	const state: FrameData = {
		delta: 0.0,
		timestamp: 0.0,
		isProcessing: false,
	};

	/**
	 * Callback to flag that the next frame should run
	 */
	const flagRunNextFrame = () => (runNextFrame = true);

	/**
	 * Create a step for each stage in the pipeline
	 */
	const steps = stepsOrder.reduce((acc, key) => {
		acc[key] = createRenderStep(flagRunNextFrame);
		return acc;
	}, {} as Steps);

	/**
	 * Destructure steps for easier access
	 */
	const { read, resolveKeyframes, update, preRender, render, postRender } = steps;

	/**
	 * Process a single batch through all pipeline steps
	 */
	const processBatch = () => {
		// Get current timestamp (or use manual timing if configured)
		const timestamp = MotionGlobalConfig.useManualTiming
			? state.timestamp
			: performance.now();

		runNextFrame = false;

		// Calculate delta, capped at maxElapsed to prevent huge jumps
		// Use default 60fps (1000/60 ≈ 16.67ms) for first frame
		state.delta = useDefaultElapsed
			? 1000 / 60
			: Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);

		state.timestamp = timestamp;
		state.isProcessing = true;

		// Process each step in order
		read.process(state);
		resolveKeyframes.process(state);
		update.process(state);
		preRender.process(state);
		render.process(state);
		postRender.process(state);

		state.isProcessing = false;

		// If keepAlive callbacks were scheduled, continue the loop
		if (runNextFrame && allowKeepAlive) {
			useDefaultElapsed = false;
			scheduleNextBatch(processBatch);
		}
	};

	/**
	 * Wake up the frameloop and schedule the next batch
	 */
	const wake = () => {
		runNextFrame = true;
		useDefaultElapsed = true;

		if (!state.isProcessing) {
			scheduleNextBatch(processBatch);
		}
	};

	/**
	 * Create schedule functions for each step
	 * These automatically wake the frameloop when scheduling
	 */
	const schedule = stepsOrder.reduce((acc, key) => {
		const step = steps[key];
		acc[key] = (process: Process, keepAlive = false, immediate = false) => {
			if (!runNextFrame) wake();
			return step.schedule(process, keepAlive, immediate);
		};
		return acc;
	}, {} as Batcher);

	/**
	 * Cancel a process from all steps
	 *
	 * @param process - The process to cancel
	 */
	const cancel = (process: Process) => {
		for (let i = 0; i < stepsOrder.length; i++) {
			steps[stepsOrder[i]].cancel(process);
		}
	};

	return { schedule, cancel, state, steps };
}
