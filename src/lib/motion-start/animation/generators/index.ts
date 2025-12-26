/**
 * Animation Generators
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Animation generators are functions that produce animation values over time.
 * They use an iterator-like pattern (next()) to generate values at specific
 * time points, making them efficient and suitable for JavaScript-based animations.
 *
 * Available generators:
 * - keyframes: Interpolates between values with easing
 * - spring: Physics-based spring animations
 * - inertia: Momentum/decay animations with boundary detection
 *
 * @module animation/generators
 */

// Core types
export type { AnimationState, KeyframeGenerator } from './types.js';

// Generators
export { keyframes, type KeyframeOptions, defaultEasing } from './keyframes.js';
export { spring, type SpringGeneratorOptions } from './spring/index.js';
export { inertia, type InertiaOptions } from './inertia.js';

// Spring utilities
export {
	findSpring,
	calcAngularFreq,
	type SpringOptions,
	type ResolvedSpringOptions,
	minDuration,
	maxDuration,
	minDamping,
	maxDamping,
} from './spring/find.js';

// Generator utilities
export {
	calcGeneratorVelocity,
	calcGeneratorDuration,
	maxGeneratorDuration,
	isGenerator,
	type AnimationGeneratorType,
	type GeneratorFactory,
} from './utils/index.js';
