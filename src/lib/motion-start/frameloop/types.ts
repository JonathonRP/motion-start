/**
 * Frameloop Type Definitions
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 */

/**
 * Process function type - accepts frame data and executes
 */
export type Process = (data: FrameData) => void;

/**
 * Schedule function type - schedules a process to run
 * @param process - The process to schedule
 * @param keepAlive - Whether to keep the process alive across frames
 * @param immediate - Whether to run immediately if currently processing
 */
export type Schedule = (
	process: Process,
	keepAlive?: boolean,
	immediate?: boolean
) => Process;

/**
 * Step interface - represents a single step in the frameloop pipeline
 */
export interface Step {
	/**
	 * Schedule a process to run in this step
	 */
	schedule: Schedule;

	/**
	 * Cancel a previously scheduled process
	 */
	cancel: (process: Process) => void;

	/**
	 * Process all scheduled callbacks for this step
	 */
	process: (data: FrameData) => void;
}

/**
 * StepId - identifies the different stages in the frameloop pipeline
 *
 * Pipeline order:
 * 1. read - Read from DOM
 * 2. resolveKeyframes - Resolve dynamic keyframes
 * 3. update - Update animation state
 * 4. preRender - Prepare for render
 * 5. render - Apply changes to DOM
 * 6. postRender - Cleanup after render
 */
export type StepId =
	| 'read'
	| 'resolveKeyframes'
	| 'update'
	| 'preRender'
	| 'render'
	| 'postRender';

/**
 * FrameData - contains timing information for the current frame
 */
export interface FrameData {
	/**
	 * Time elapsed since last frame in milliseconds
	 */
	delta: number;

	/**
	 * Current timestamp in milliseconds
	 */
	timestamp: number;

	/**
	 * Whether the frameloop is currently processing
	 */
	isProcessing: boolean;
}

/**
 * Batcher - maps each step to a schedule function
 */
export type Batcher = {
	[key in StepId]: Schedule;
};

/**
 * Steps - maps each step to a Step interface
 */
export type Steps = {
	[key in StepId]: Step;
};
