/**
 * Spring Parameter Resolution
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Resolves spring physics parameters (stiffness, damping) from
 * duration and bounce values. This allows defining springs in
 * more intuitive terms rather than raw physics values.
 *
 * This is ported from the Framer implementation of duration-based
 * spring resolution.
 */

import { warning } from '../../../utils/errors.js';
import { clamp } from '../../../utils/clamp.js';
import { millisecondsToSeconds, secondsToMilliseconds } from '../../../utils/time-conversion.js';

/**
 * Spring options that can use duration/bounce OR stiffness/damping
 */
export interface SpringOptions {
	/**
	 * Duration in milliseconds (alternative to stiffness/damping)
	 * @default 800
	 */
	duration?: number;

	/**
	 * Bounce amount (0 = no bounce, 1 = very bouncy)
	 * @default 0.25
	 */
	bounce?: number;

	/**
	 * Initial velocity
	 * @default 0
	 */
	velocity?: number;

	/**
	 * Spring mass
	 * @default 1
	 */
	mass?: number;

	/**
	 * Spring stiffness (alternative to duration/bounce)
	 */
	stiffness?: number;

	/**
	 * Spring damping (alternative to duration/bounce)
	 */
	damping?: number;
}

/**
 * Resolved spring parameters
 */
export interface ResolvedSpringOptions {
	stiffness: number;
	damping: number;
	duration: number;
}

/**
 * Function that resolves a value at a given input
 */
type Resolver = (num: number) => number;

const safeMin = 0.001;
export const minDuration = 0.01;
export const maxDuration = 10.0;
export const minDamping = 0.05;
export const maxDamping = 1;

/**
 * Find spring parameters from duration and bounce
 *
 * Uses Newton-Raphson method to solve for the undamped frequency
 * that produces the desired duration and bounce characteristics.
 *
 * @param options - Spring options with duration/bounce
 * @returns Resolved stiffness, damping, and duration
 *
 * @example
 * ```ts
 * const params = findSpring({
 *   duration: 1000,
 *   bounce: 0.3,
 * });
 * // Returns: { stiffness: ~170, damping: ~20, duration: 1000 }
 * ```
 */
export function findSpring({
	duration = 800,
	bounce = 0.25,
	velocity = 0,
	mass = 1,
}: SpringOptions): ResolvedSpringOptions {
	let envelope: Resolver;
	let derivative: Resolver;

	warning(
		duration <= secondsToMilliseconds(maxDuration),
		'Spring duration must be 10 seconds or less'
	);

	let dampingRatio = 1 - bounce;

	/**
	 * Restrict dampingRatio and duration to within acceptable ranges.
	 */
	dampingRatio = clamp(minDamping, maxDamping, dampingRatio);
	duration = clamp(minDuration, maxDuration, millisecondsToSeconds(duration));

	if (dampingRatio < 1) {
		/**
		 * Underdamped spring
		 */
		envelope = (undampedFreq) => {
			const exponentialDecay = undampedFreq * dampingRatio;
			const delta = exponentialDecay * duration;
			const a = exponentialDecay - velocity;
			const b = calcAngularFreq(undampedFreq, dampingRatio);
			const c = Math.exp(-delta);
			return safeMin - (a / b) * c;
		};

		derivative = (undampedFreq) => {
			const exponentialDecay = undampedFreq * dampingRatio;
			const delta = exponentialDecay * duration;
			const d = delta * velocity + velocity;
			const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq, 2) * duration;
			const f = Math.exp(-delta);
			const g = calcAngularFreq(Math.pow(undampedFreq, 2), dampingRatio);
			const factor = -envelope(undampedFreq) + safeMin > 0 ? -1 : 1;
			return (factor * (d - e) * f) / g;
		};
	} else {
		/**
		 * Critically-damped spring
		 */
		envelope = (undampedFreq) => {
			const a = Math.exp(-undampedFreq * duration);
			const b = (undampedFreq - velocity) * duration + 1;
			return -safeMin + a * b;
		};

		derivative = (undampedFreq) => {
			const a = Math.exp(-undampedFreq * duration);
			const b = (velocity - undampedFreq) * (duration * duration);
			return a * b;
		};
	}

	const initialGuess = 5 / duration;
	const undampedFreq = approximateRoot(envelope, derivative, initialGuess);

	duration = secondsToMilliseconds(duration);

	if (isNaN(undampedFreq)) {
		return {
			stiffness: 100,
			damping: 10,
			duration,
		};
	} else {
		const stiffness = Math.pow(undampedFreq, 2) * mass;
		return {
			stiffness,
			damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
			duration,
		};
	}
}

/**
 * Number of iterations for Newton-Raphson root finding
 */
const rootIterations = 12;

/**
 * Approximate root using Newton-Raphson method
 *
 * @param envelope - Function to find root of
 * @param derivative - Derivative of envelope function
 * @param initialGuess - Starting guess for root
 * @returns Approximated root
 */
function approximateRoot(envelope: Resolver, derivative: Resolver, initialGuess: number): number {
	let result = initialGuess;
	for (let i = 1; i < rootIterations; i++) {
		result = result - envelope(result) / derivative(result);
	}
	return result;
}

/**
 * Calculate angular frequency for underdamped spring
 *
 * @param undampedFreq - Undamped natural frequency
 * @param dampingRatio - Damping ratio (0-1)
 * @returns Angular frequency accounting for damping
 */
export function calcAngularFreq(undampedFreq: number, dampingRatio: number): number {
	return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
