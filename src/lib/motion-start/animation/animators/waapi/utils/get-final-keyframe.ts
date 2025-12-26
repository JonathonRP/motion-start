/**
 * Get Final Keyframe Utility
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Extracts the final value from keyframes or keyframe objects.
 */

/**
 * Get the final value from a keyframe array or object
 *
 * @param keyframes - Keyframes array or object
 * @returns The final keyframe value
 */
export function getFinalKeyframe<T>(
	keyframes: T[] | Record<string, T[]>
): T | Record<string, T> {
	// Handle array of keyframes
	if (Array.isArray(keyframes)) {
		return keyframes[keyframes.length - 1];
	}

	// Handle object of keyframe arrays
	const result: Record<string, T> = {};
	for (const key in keyframes) {
		const keyframeArray = keyframes[key];
		if (Array.isArray(keyframeArray)) {
			result[key] = keyframeArray[keyframeArray.length - 1];
		}
	}

	return result as T;
}
