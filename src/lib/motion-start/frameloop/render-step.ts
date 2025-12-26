/**
 * Render Step Implementation
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Creates a step in the frameloop pipeline that manages callback scheduling
 * and execution. Each step maintains two queues (current frame and next frame)
 * and can process callbacks with keepAlive behavior.
 */

import type { Step, Process, FrameData } from './types.js';

/**
 * Creates a render step that manages callback execution for a specific stage
 * in the frameloop pipeline.
 *
 * @param runNextFrame - Callback to trigger the next frame
 * @returns A Step interface for scheduling and processing callbacks
 */
export function createRenderStep(runNextFrame: () => void): Step {
	/**
	 * Queue for callbacks to execute in the current frame
	 */
	let thisFrame = new Set<Process>();

	/**
	 * Queue for callbacks to execute in the next frame
	 */
	let nextFrame = new Set<Process>();

	/**
	 * Flag indicating if we're currently processing callbacks
	 */
	let isProcessing = false;

	/**
	 * Flag to trigger processing the next frame immediately after current frame
	 */
	let flushNextFrame = false;

	/**
	 * WeakSet of processes that should be kept alive across frames
	 * Using WeakSet allows garbage collection when the process is no longer referenced
	 */
	const toKeepAlive = new WeakSet<Process>();

	/**
	 * Latest frame data - shared across all callbacks in this step
	 */
	let latestFrameData: FrameData = {
		delta: 0.0,
		timestamp: 0.0,
		isProcessing: false,
	};

	/**
	 * Triggers a callback and reschedules it if keepAlive is set
	 *
	 * @param callback - The process to execute
	 */
	function triggerCallback(callback: Process) {
		// If this callback should persist, reschedule it for next frame
		if (toKeepAlive.has(callback)) {
			step.schedule(callback);
			runNextFrame();
		}

		// Execute the callback with current frame data
		callback(latestFrameData);
	}

	/**
	 * The step interface
	 */
	const step: Step = {
		/**
		 * Schedule a process to run
		 *
		 * @param callback - The process to schedule
		 * @param keepAlive - If true, the process will be rescheduled after execution
		 * @param immediate - If true and currently processing, add to current frame
		 * @returns The callback (for chaining)
		 */
		schedule: (callback, keepAlive = false, immediate = false) => {
			// Determine which queue to add to
			const addToCurrentFrame = immediate && isProcessing;
			const queue = addToCurrentFrame ? thisFrame : nextFrame;

			// Mark for keepAlive if requested
			if (keepAlive) toKeepAlive.add(callback);

			// Add to queue if not already present
			if (!queue.has(callback)) queue.add(callback);

			return callback;
		},

		/**
		 * Cancel a scheduled process
		 *
		 * @param callback - The process to cancel
		 */
		cancel: (callback) => {
			nextFrame.delete(callback);
			toKeepAlive.delete(callback);
		},

		/**
		 * Process all callbacks scheduled for this step
		 *
		 * @param frameData - Timing data for this frame
		 */
		process: (frameData) => {
			latestFrameData = frameData;

			// If we're already processing, mark to flush after
			if (isProcessing) {
				flushNextFrame = true;
				return;
			}

			// Start processing
			isProcessing = true;

			// Swap queues: nextFrame becomes thisFrame, clear nextFrame
			[thisFrame, nextFrame] = [nextFrame, thisFrame];
			nextFrame.clear();

			// Execute all callbacks in thisFrame
			thisFrame.forEach(triggerCallback);

			// Done processing
			isProcessing = false;

			// If callbacks were added during processing, process them now
			if (flushNextFrame) {
				flushNextFrame = false;
				step.process(frameData);
			}
		},
	};

	return step;
}
