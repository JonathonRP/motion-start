/**
 * WAAPI Integration Module
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Exports Web Animations API integration utilities.
 */

export { NativeAnimation } from './NativeAnimation.js';
export {
	createAcceleratedAnimation,
	canAccelerateProperty,
	type AcceleratedAnimationOptions,
	type WaapiKeyframe,
} from './create-accelerated-animation.js';
export { supportsWaapi, getSupportsWaapi } from './utils/supports-waapi.js';
export {
	supportsLinearEasing,
	getSupportsLinearEasing,
} from './utils/supports-linear-easing.js';
export { easingToString, cubicBezierAsString } from './utils/easing-to-string.js';
export { getFinalKeyframe } from './utils/get-final-keyframe.js';
