/**
 * Frameloop Driver
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Animation driver that integrates with the frameloop system.
 * This driver schedules animation updates through the frameloop's
 * update step for optimal performance and batching.
 */

import { frame, cancelFrame } from '../../../frameloop/index.js';
import type { FrameData } from '../../../frameloop/types.js';

/**
 * Driver update callback
 * Receives timestamp and elapsed time since last frame
 */
export type DriverUpdateCallback = (timestamp: number, delta: number) => void;

/**
 * Driver interface
 */
export interface Driver {
	/**
	 * Start the driver with an update callback
	 * @param update - Callback to run on each frame
	 * @returns Stop function
	 */
	start: (update: DriverUpdateCallback) => () => void;
}

/**
 * Create a frameloop-based animation driver
 *
 * This driver:
 * - Schedules updates through the frameloop's 'update' step
 * - Provides timestamp and delta time to the update callback
 * - Automatically cancels when stopped
 * - Uses keepAlive to maintain the frameloop while animating
 *
 * @returns Driver instance
 */
export function createFrameloopDriver(): Driver {
	return {
		start: (update: DriverUpdateCallback) => {
			let isRunning = true;

			/**
			 * Frame update handler
			 */
			const onFrame = (frameData: FrameData) => {
				if (!isRunning) return;

				// Call the animation update with timestamp and delta
				update(frameData.timestamp, frameData.delta);
			};

			// Schedule on the 'update' step with keepAlive=true
			// This ensures the frameloop continues while the animation runs
			frame.update(onFrame, true);

			/**
			 * Stop function
			 */
			return () => {
				isRunning = false;
				cancelFrame(onFrame);
			};
		},
	};
}

/**
 * Default driver instance using frameloop
 * Used by MainThreadAnimation for scheduling updates
 */
export const frameloopDriver = createFrameloopDriver();
