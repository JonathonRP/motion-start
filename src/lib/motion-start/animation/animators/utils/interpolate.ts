/**
 * Keyframe Interpolation Utilities
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Utilities for interpolating between keyframes with easing functions.
 */

import type { Easing } from '../../../types.js';
import { interpolate as popmotionInterpolate } from 'popmotion';
import { easingDefinitionToFunction } from '../../utils/easing.js';

/**
 * Default easing for keyframe animations
 */
const defaultEasing = (t: number) => t;

/**
 * Create an interpolator for keyframe values
 *
 * @param keyframes - Array of keyframe values
 * @param easing - Easing function or array of easing functions
 * @param offset - Optional custom offset values (0-1) for each keyframe
 * @returns Interpolation function that takes progress (0-1) and returns interpolated value
 */
export function interpolateKeyframes<T>(
	keyframes: T[],
	easing?: Easing | Easing[],
	offset?: number[]
): (progress: number) => T {
	const length = keyframes.length;

	// Single keyframe - always return it
	if (length === 1) {
		return () => keyframes[0];
	}

	// Two keyframes - simple interpolation
	if (length === 2 && !offset) {
		const easingFn = easing
			? Array.isArray(easing)
				? easingDefinitionToFunction(easing[0])
				: easingDefinitionToFunction(easing)
			: defaultEasing;

		return (progress: number) => {
			const easedProgress = easingFn(progress);
			return popmotionInterpolate([0, 1], keyframes as any)(easedProgress) as T;
		};
	}

	// Multiple keyframes - use popmotion's interpolate with segments
	// Generate default offsets if not provided
	const offsets = offset || keyframes.map((_, i) => i / (length - 1));

	// Process easing - can be single easing or array of easings (one per segment)
	let easingFunctions: ((t: number) => number)[];

	if (!easing) {
		// No easing - use linear
		easingFunctions = keyframes.map(() => defaultEasing);
	} else if (Array.isArray(easing)) {
		// Array of easings - one per segment
		// There should be (length - 1) easings for the segments between keyframes
		easingFunctions = easing.map(easingDefinitionToFunction);
	} else {
		// Single easing - use for all segments
		const singleEasing = easingDefinitionToFunction(easing);
		easingFunctions = keyframes.map(() => singleEasing);
	}

	// Create interpolator
	return (progress: number) => {
		// Find which segment we're in
		let segmentIndex = 0;
		for (let i = 1; i < offsets.length; i++) {
			if (progress < offsets[i]) {
				segmentIndex = i - 1;
				break;
			}
			segmentIndex = i - 1;
		}

		// Calculate progress within the segment
		const segmentStart = offsets[segmentIndex];
		const segmentEnd = offsets[segmentIndex + 1] || 1;
		const segmentProgress = (progress - segmentStart) / (segmentEnd - segmentStart);

		// Apply easing to segment progress
		const easingFn = easingFunctions[segmentIndex] || defaultEasing;
		const easedProgress = easingFn(Math.max(0, Math.min(1, segmentProgress)));

		// Interpolate between the two keyframes
		const from = keyframes[segmentIndex];
		const to = keyframes[segmentIndex + 1];

		return popmotionInterpolate([0, 1], [from, to] as any)(easedProgress) as T;
	};
}

/**
 * Get value at a specific progress point in keyframes
 *
 * @param keyframes - Array of keyframe values
 * @param progress - Progress value (0-1)
 * @param easing - Optional easing function(s)
 * @param offset - Optional custom offset values
 * @returns Value at the specified progress
 */
export function getValueAtProgress<T>(
	keyframes: T[],
	progress: number,
	easing?: Easing | Easing[],
	offset?: number[]
): T {
	const interpolator = interpolateKeyframes(keyframes, easing, offset);
	return interpolator(progress);
}
