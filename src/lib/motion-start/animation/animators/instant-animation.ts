/**
 * Instant Animation
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Utility for creating instant (zero-duration) transitions.
 * Used when animation type is set to false or duration is 0.
 */

import type { AnimationPlaybackControls } from '../animate/index.js';

/**
 * Create an instant animation that sets a value immediately
 *
 * This is used when:
 * - type: false in transition options
 * - duration: 0
 * - Immediate value setting is desired
 *
 * @param setValue - Function to set the final value
 * @param onComplete - Optional callback when complete
 * @returns AnimationPlaybackControls with only stop() method
 */
export function instantAnimation(
	setValue: () => void,
	onComplete?: () => void
): AnimationPlaybackControls {
	// Set the value immediately
	setValue();

	// Call onComplete if provided
	if (onComplete) {
		onComplete();
	}

	// Return minimal controls
	return {
		stop: () => {
			// Already complete, nothing to stop
		},
	};
}

/**
 * Check if a transition should be instant
 *
 * @param transition - Transition options
 * @returns true if animation should be instant
 */
export function isInstantTransition(transition: any): boolean {
	return (
		transition?.type === false ||
		transition?.duration === 0 ||
		(transition?.type === 'tween' && transition?.duration === 0)
	);
}
