/**
 * Animation Animators Module
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Complete animation animator system including:
 * - BaseAnimation: Abstract base class for all animators
 * - MainThreadAnimation: JavaScript-based animations using frameloop
 * - AcceleratedAnimation: Hardware-accelerated animations using WAAPI
 * - Drivers: Animation scheduling through frameloop
 * - WAAPI: Web Animations API integration
 * - Utilities: Helper functions for animation calculations
 */

// Base classes
export {
	BaseAnimation,
	AnimationState,
	type BaseAnimationOptions,
	type ResolvedAnimationData,
} from './BaseAnimation.js';

// Main thread animation
export {
	MainThreadAnimation,
	type MainThreadAnimationOptions,
	type MainThreadResolvedData,
	type AnimationType,
	type AnimationGenerator,
} from './MainThreadAnimation.js';

// Accelerated animation
export {
	AcceleratedAnimation,
	type AcceleratedAnimationOptions,
	type AcceleratedResolvedData,
} from './AcceleratedAnimation.js';

// Instant animation
export { instantAnimation, isInstantTransition } from './instant-animation.js';

// Drivers
export {
	createFrameloopDriver,
	frameloopDriver,
	type Driver,
	type DriverUpdateCallback,
} from './drivers/driver-frameloop.js';

// WAAPI integration
export * from './waapi/index.js';

// Utilities
export {
	calcElapsedTime,
	calcProgress,
	calcIteration,
	calcIterationProgress,
	applyRepeatType,
} from './utils/elapsed.js';

export {
	interpolateKeyframes,
	getValueAtProgress,
} from './utils/interpolate.js';
