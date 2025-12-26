/**
 * Motion Global Configuration
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Global configuration object for controlling motion behavior across the application.
 * This allows toggling animations and manual timing control globally.
 */

export const MotionGlobalConfig = {
	/**
	 * When true, all animations will be skipped
	 * Useful for testing or accessibility preferences
	 */
	skipAnimations: false,

	/**
	 * When true, use manual timing instead of performance.now()
	 * Useful for testing or synchronized animations
	 */
	useManualTiming: false,
};
