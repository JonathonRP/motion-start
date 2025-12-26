/**
 * Create Accelerated Animation
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Factory for creating hardware-accelerated animations using WAAPI.
 * Converts keyframes and options to native Web Animations API format.
 */

import { NativeAnimation } from './NativeAnimation.js';
import { easingToString } from './utils/easing-to-string.js';
import { getSupportsWaapi } from './utils/supports-waapi.js';
import type { Easing } from '../../../types.js';

/**
 * Options for creating an accelerated animation
 */
export interface AcceleratedAnimationOptions {
	/**
	 * Duration in milliseconds
	 */
	duration?: number;

	/**
	 * Delay before starting (ms)
	 */
	delay?: number;

	/**
	 * Easing function
	 */
	ease?: Easing | Easing[];

	/**
	 * Number of iterations
	 */
	iterations?: number;

	/**
	 * Direction of playback
	 */
	direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

	/**
	 * Fill mode
	 */
	fill?: 'none' | 'forwards' | 'backwards' | 'both';

	/**
	 * Callback when animation finishes
	 */
	onFinish?: () => void;
}

/**
 * Keyframe format for WAAPI
 */
export type WaapiKeyframe = Record<string, string | number>;

/**
 * Create a WAAPI animation on an element
 *
 * @param element - DOM element to animate
 * @param keyframes - Array of keyframe objects
 * @param options - Animation options
 * @returns NativeAnimation wrapper, or null if WAAPI not supported
 */
export function createAcceleratedAnimation(
	element: Element,
	keyframes: WaapiKeyframe[],
	options: AcceleratedAnimationOptions = {}
): NativeAnimation | null {
	// Check WAAPI support
	if (!getSupportsWaapi()) {
		return null;
	}

	// Convert easing to string
	const easingString = easingToString(options.ease);

	// If easing can't be converted (e.g., custom function), return null
	// The caller should fall back to MainThreadAnimation
	if (!easingString && options.ease) {
		return null;
	}

	// Build WAAPI options
	const timing: KeyframeAnimationOptions = {
		duration: options.duration || 300,
		delay: options.delay || 0,
		easing: easingString || 'linear',
		iterations: options.iterations || 1,
		direction: options.direction || 'normal',
		fill: options.fill || 'both',
	};

	try {
		// Create the animation
		const animation = element.animate(keyframes, timing);

		// Attach finish callback if provided
		if (options.onFinish) {
			animation.onfinish = options.onFinish;
		}

		return new NativeAnimation(animation);
	} catch (e) {
		console.warn('Failed to create WAAPI animation:', e);
		return null;
	}
}

/**
 * Check if a property can be hardware accelerated
 *
 * Only transform and opacity are guaranteed to be GPU-accelerated
 * across all browsers.
 */
export function canAccelerateProperty(property: string): boolean {
	const acceleratedProperties = new Set([
		'transform',
		'opacity',
		'filter',
		// Also check for individual transform properties
		'x',
		'y',
		'z',
		'scale',
		'scaleX',
		'scaleY',
		'scaleZ',
		'rotate',
		'rotateX',
		'rotateY',
		'rotateZ',
		'skew',
		'skewX',
		'skewY',
	]);

	return acceleratedProperties.has(property);
}
