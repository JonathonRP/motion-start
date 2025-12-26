/**
 * Animation Generator Types
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Core type definitions for animation generators.
 * Generators are functions that produce animation values over time
 * using the JavaScript generator protocol (next()).
 */

/**
 * Animation state returned by generator on each tick
 *
 * @typeParam V - The value type being animated
 */
export interface AnimationState<V> {
	/**
	 * Current animation value
	 */
	value: V;

	/**
	 * Whether the animation has completed
	 */
	done: boolean;
}

/**
 * Keyframe generator interface
 *
 * Generators use an iterator-like pattern (but are not actual iterators)
 * to produce animation values over time. They're stateful and mutable
 * to reduce GC pressure during animation.
 *
 * @typeParam V - The value type being animated
 */
export interface KeyframeGenerator<V> {
	/**
	 * Calculated duration in milliseconds
	 * null if the animation has no fixed duration (e.g., spring animations)
	 */
	calculatedDuration: number | null;

	/**
	 * Get the next animation state at time t
	 *
	 * @param t - Time in milliseconds from animation start
	 * @returns Current animation state with value and done flag
	 */
	next: (t: number) => AnimationState<V>;
}
