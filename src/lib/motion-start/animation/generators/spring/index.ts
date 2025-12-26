/**
 * Spring Animation Generator
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Spring physics-based animation generator.
 * Supports underdamped, critically damped, and overdamped springs.
 * Can be configured with either physics parameters (stiffness/damping)
 * or intuitive parameters (duration/bounce).
 */

import { millisecondsToSeconds, secondsToMilliseconds } from '../../../utils/time-conversion.js';
import type { AnimationState, KeyframeGenerator } from '../types.js';
import { calcGeneratorVelocity } from '../utils/velocity.js';
import { calcAngularFreq, findSpring, type SpringOptions } from './find.js';

/**
 * Spring animation options
 */
export interface SpringGeneratorOptions {
	/**
	 * Array of keyframe values (start and end)
	 */
	keyframes: number[];

	/**
	 * Rest delta - threshold for position settling
	 * Animation completes when displacement is less than this
	 */
	restDelta?: number;

	/**
	 * Rest speed - threshold for velocity settling
	 * Animation completes when velocity is less than this (px/s)
	 */
	restSpeed?: number;

	/**
	 * Spring stiffness (higher = faster/snappier)
	 * @default 100
	 */
	stiffness?: number;

	/**
	 * Spring damping (higher = less oscillation)
	 * @default 10
	 */
	damping?: number;

	/**
	 * Spring mass (higher = more inertia)
	 * @default 1
	 */
	mass?: number;

	/**
	 * Duration in milliseconds (alternative to stiffness/damping)
	 * @default 800
	 */
	duration?: number;

	/**
	 * Bounce amount (0 = no bounce, 1 = very bouncy)
	 * Alternative to stiffness/damping
	 * @default 0.25
	 */
	bounce?: number;

	/**
	 * Initial velocity (px/ms, will be converted to px/s internally)
	 * @default 0
	 */
	velocity?: number;
}

/**
 * Duration/bounce parameters
 */
const durationKeys = ['duration', 'bounce'];

/**
 * Physics parameters
 */
const physicsKeys = ['stiffness', 'damping', 'mass'];

/**
 * Check if spring options contain any of the specified keys
 */
function isSpringType(options: SpringOptions, keys: string[]): boolean {
	return keys.some((key) => (options as any)[key] !== undefined);
}

/**
 * Resolved spring options with physics parameters
 */
interface ResolvedSpringOptions extends Required<SpringOptions> {
	isResolvedFromDuration: boolean;
}

/**
 * Get spring options, resolving duration/bounce to stiffness/damping if needed
 */
function getSpringOptions(options: Omit<SpringGeneratorOptions, 'keyframes'>): ResolvedSpringOptions {
	let springOptions: ResolvedSpringOptions = {
		velocity: 0.0,
		stiffness: 100,
		damping: 10,
		mass: 1.0,
		duration: 800,
		bounce: 0.25,
		isResolvedFromDuration: false,
		...options,
	};

	// stiffness/damping/mass overrides duration/bounce
	if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
		const derived = findSpring(options);

		springOptions = {
			...springOptions,
			...derived,
			mass: 1.0,
		};
		springOptions.isResolvedFromDuration = true;
	}

	return springOptions;
}

/**
 * Create a spring animation generator
 *
 * Generates values using spring physics equations.
 * Handles three spring types:
 * - Underdamped (dampingRatio < 1): Oscillates before settling
 * - Critically damped (dampingRatio = 1): Fastest settling without oscillation
 * - Overdamped (dampingRatio > 1): Slow settling without oscillation
 *
 * @param options - Spring animation options
 * @returns A spring generator
 *
 * @example
 * ```ts
 * // Using physics parameters
 * const springGen = spring({
 *   keyframes: [0, 100],
 *   stiffness: 100,
 *   damping: 10
 * });
 *
 * // Using duration/bounce
 * const springGen2 = spring({
 *   keyframes: [0, 100],
 *   duration: 1000,
 *   bounce: 0.3
 * });
 * ```
 */
export function spring({
	keyframes,
	restDelta,
	restSpeed,
	...options
}: SpringGeneratorOptions): KeyframeGenerator<number> {
	const origin = keyframes[0];
	const target = keyframes[keyframes.length - 1];

	/**
	 * This is the Iterator-spec return value. We ensure it's mutable rather than using a generator
	 * to reduce GC during animation.
	 */
	const state: AnimationState<number> = { done: false, value: origin };

	const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } =
		getSpringOptions({
			...options,
			velocity: -millisecondsToSeconds(options.velocity || 0),
		});

	const initialVelocity = velocity || 0.0;
	const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));

	const initialDelta = target - origin;
	const undampedAngularFreq = millisecondsToSeconds(Math.sqrt(stiffness / mass));

	/**
	 * If we're working on a granular scale, use smaller defaults for determining
	 * when the spring is finished.
	 *
	 * These defaults have been selected empirically based on what strikes a good
	 * ratio between feeling good and finishing as soon as changes are imperceptible.
	 */
	const isGranularScale = Math.abs(initialDelta) < 5;
	restSpeed ||= isGranularScale ? 0.01 : 2;
	restDelta ||= isGranularScale ? 0.005 : 0.5;

	let resolveSpring: (t: number) => number;

	if (dampingRatio < 1) {
		const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);

		// Underdamped spring
		resolveSpring = (t: number) => {
			const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);

			return (
				target -
				envelope *
					(((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) /
						angularFreq) *
						Math.sin(angularFreq * t) +
						initialDelta * Math.cos(angularFreq * t))
			);
		};
	} else if (dampingRatio === 1) {
		// Critically damped spring
		resolveSpring = (t: number) =>
			target -
			Math.exp(-undampedAngularFreq * t) *
				(initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
	} else {
		// Overdamped spring
		const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);

		resolveSpring = (t: number) => {
			const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);

			// When performing sinh or cosh values can hit Infinity so we cap them here
			const freqForT = Math.min(dampedAngularFreq * t, 300);

			return (
				target -
				(envelope *
					((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) *
						Math.sinh(freqForT) +
						dampedAngularFreq * initialDelta * Math.cosh(freqForT))) /
					dampedAngularFreq
			);
		};
	}

	return {
		calculatedDuration: isResolvedFromDuration ? duration || null : null,
		next: (t: number) => {
			const current = resolveSpring(t);

			if (!isResolvedFromDuration) {
				let currentVelocity = 0.0;

				/**
				 * We only need to calculate velocity for under-damped springs
				 * as over- and critically-damped springs can't overshoot, so
				 * checking only for displacement is enough.
				 */
				if (dampingRatio < 1) {
					currentVelocity =
						t === 0
							? secondsToMilliseconds(initialVelocity)
							: calcGeneratorVelocity(resolveSpring, t, current);
				}

				const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed!;
				const isBelowDisplacementThreshold = Math.abs(target - current) <= restDelta!;

				state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
			} else {
				state.done = t >= duration!;
			}

			state.value = state.done ? target : current;

			return state;
		},
	};
}
