/**
 * Inertia Animation Generator
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Inertia (momentum/decay) animation generator.
 * Creates natural deceleration animations from an initial velocity,
 * with optional boundary detection and bounce.
 */

import type { AnimationState, KeyframeGenerator } from './types.js';
import { spring as createSpring } from './spring/index.js';
import { calcGeneratorVelocity } from './utils/velocity.js';

/**
 * Inertia animation options
 */
export interface InertiaOptions {
	/**
	 * Array with starting value
	 */
	keyframes: number[];

	/**
	 * Initial velocity (px/ms)
	 * @default 0
	 */
	velocity?: number;

	/**
	 * Power factor affecting deceleration rate
	 * Higher = faster deceleration
	 * @default 0.8
	 */
	power?: number;

	/**
	 * Time constant for exponential decay (ms)
	 * @default 325
	 */
	timeConstant?: number;

	/**
	 * Bounce damping when hitting boundaries
	 * @default 10
	 */
	bounceDamping?: number;

	/**
	 * Bounce stiffness when hitting boundaries
	 * @default 500
	 */
	bounceStiffness?: number;

	/**
	 * Function to modify the calculated target
	 * Useful for snapping to grid, etc.
	 */
	modifyTarget?: (v: number) => number;

	/**
	 * Minimum boundary value
	 */
	min?: number;

	/**
	 * Maximum boundary value
	 */
	max?: number;

	/**
	 * Rest delta - threshold for position settling
	 * @default 0.5
	 */
	restDelta?: number;

	/**
	 * Rest speed - threshold for velocity settling (px/s)
	 */
	restSpeed?: number;
}

/**
 * Create an inertia animation generator
 *
 * Simulates momentum/decay with exponential deceleration.
 * When boundaries are hit, transitions to a spring animation for bounce.
 *
 * The animation follows these phases:
 * 1. Friction phase: Exponential decay based on velocity and power
 * 2. Boundary check: Detects if value exceeds min/max
 * 3. Spring phase: If boundary hit, bounces back using spring physics
 *
 * @param options - Inertia animation options
 * @returns An inertia generator
 *
 * @example
 * ```ts
 * // Basic decay from velocity
 * const inertiaGen = inertia({
 *   keyframes: [0],
 *   velocity: 100,
 *   power: 0.8
 * });
 *
 * // With boundaries
 * const boundedGen = inertia({
 *   keyframes: [50],
 *   velocity: 200,
 *   min: 0,
 *   max: 100,
 *   bounceDamping: 10,
 *   bounceStiffness: 500
 * });
 * ```
 */
export function inertia({
	keyframes,
	velocity = 0.0,
	power = 0.8,
	timeConstant = 325,
	bounceDamping = 10,
	bounceStiffness = 500,
	modifyTarget,
	min,
	max,
	restDelta = 0.5,
	restSpeed,
}: InertiaOptions): KeyframeGenerator<number> {
	const origin = keyframes[0];

	const state: AnimationState<number> = {
		done: false,
		value: origin,
	};

	/**
	 * Check if value is outside bounds
	 */
	const isOutOfBounds = (v: number) =>
		(min !== undefined && v < min) || (max !== undefined && v > max);

	/**
	 * Find which boundary is nearest to value
	 */
	const nearestBoundary = (v: number) => {
		if (min === undefined) return max;
		if (max === undefined) return min;

		return Math.abs(min - v) < Math.abs(max - v) ? min : max;
	};

	let amplitude = power * velocity;
	const ideal = origin + amplitude;
	const target = modifyTarget === undefined ? ideal : modifyTarget(ideal);

	/**
	 * If the target has changed we need to re-calculate the amplitude, otherwise
	 * the animation will start from the wrong position.
	 */
	if (target !== ideal) amplitude = target - origin;

	/**
	 * Calculate delta (distance from target) at time t
	 */
	const calcDelta = (t: number) => -amplitude * Math.exp(-t / timeConstant);

	/**
	 * Calculate current value at time t
	 */
	const calcLatest = (t: number) => target + calcDelta(t);

	/**
	 * Apply friction decay to state
	 */
	const applyFriction = (t: number) => {
		const delta = calcDelta(t);
		const latest = calcLatest(t);
		state.done = Math.abs(delta) <= restDelta;
		state.value = state.done ? target : latest;
	};

	/**
	 * Ideally this would resolve for t in a stateless way, we could
	 * do that by always precalculating the animation but as we know
	 * this will be done anyway we can assume that spring will
	 * be discovered during that.
	 */
	let timeReachedBoundary: number | undefined;
	let spring: KeyframeGenerator<number> | undefined;

	/**
	 * Check if we've hit a boundary and need to create spring
	 */
	const checkCatchBoundary = (t: number) => {
		if (!isOutOfBounds(state.value)) return;

		timeReachedBoundary = t;

		spring = createSpring({
			keyframes: [state.value, nearestBoundary(state.value)!],
			velocity: calcGeneratorVelocity(calcLatest, t, state.value),
			damping: bounceDamping,
			stiffness: bounceStiffness,
			restDelta,
			restSpeed,
		});
	};

	checkCatchBoundary(0);

	return {
		calculatedDuration: null,
		next: (t: number) => {
			/**
			 * We need to resolve the friction to figure out if we need a
			 * spring but we don't want to do this twice per frame. So here
			 * we flag if we updated for this frame and later if we did
			 * we can skip doing it again.
			 */
			let hasUpdatedFrame = false;
			if (!spring && timeReachedBoundary === undefined) {
				hasUpdatedFrame = true;
				applyFriction(t);
				checkCatchBoundary(t);
			}

			/**
			 * If we have a spring and the provided t is beyond the moment the friction
			 * animation crossed the min/max boundary, use the spring.
			 */
			if (timeReachedBoundary !== undefined && t >= timeReachedBoundary) {
				return spring!.next(t - timeReachedBoundary);
			} else {
				!hasUpdatedFrame && applyFriction(t);
				return state;
			}
		},
	};
}
