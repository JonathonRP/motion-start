/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { describe, test, expect } from 'vitest';
import type { ValueAnimationOptions } from '../../types.js';
import { spring } from '../spring/index.js';
import { animateSync } from './utils.js';
import { calcGeneratorDuration } from '../utils/calc-duration.js';

describe('spring', () => {
	test('Runs animations with default values ', () => {
		expect(animateSync(spring({ keyframes: [0, 1] }), 200)).toEqual([0, 1, 1, 1, 1, 1, 1, 1]);
	});

	test('Underdamped spring', () => {
		expect(
			animateSync(
				spring({
					keyframes: [100, 1000],
					stiffness: 300,
					restSpeed: 10,
					restDelta: 0.5,
				}),
				200
			)
		).toEqual([100, 1343, 873, 1046, 984, 1005, 998, 1001, 1000]);
	});

	test('Velocity passed to underdamped spring', () => {
		const settings: ValueAnimationOptions<number> = {
			keyframes: [100, 1000],
			stiffness: 300,
			restSpeed: 10,
			restDelta: 0.5,
		};

		const noVelocity = animateSync(spring(settings), 200);
		const velocity = animateSync(spring({ ...settings, velocity: 1000 }), 200);

		expect(noVelocity).not.toEqual(velocity);
	});

	test('Critically damped spring', () => {
		expect(
			animateSync(
				spring({
					keyframes: [100, 1000],
					stiffness: 100,
					damping: 20,
					restSpeed: 10,
					restDelta: 0.5,
				}),
				200
			)
		).toEqual([100, 635, 918, 984, 997, 1000]);
	});

	test('Velocity passed to critically spring', () => {
		const settings = {
			keyframes: [100, 1000],
			stiffness: 100,
			damping: 20,
			restSpeed: 10,
			restDelta: 0.5,
		};

		const noVelocity = animateSync(spring(settings), 200);
		const velocity = animateSync(spring({ ...settings, velocity: 1000 }), 200);

		expect(noVelocity).not.toEqual(velocity);
	});

	test('Overdamped spring', () => {
		expect(
			animateSync(
				spring({
					keyframes: [100, 1000],
					stiffness: 300,
					damping: 100,
					restSpeed: 10,
					restDelta: 0.5,
				}),
				200
			)
		).toEqual([100, 499, 731, 855, 922, 958, 977, 988, 993, 996, 998, 999, 999, 1000]);
	});
	test('Overdamped spring with very high stiffness/damping', () => {
		expect(
			animateSync(
				spring({
					keyframes: [100, 1000],
					stiffness: 1000000,
					damping: 10000000,
					restDelta: 1,
					restSpeed: 10,
				}),
				200
			)
		).toEqual([100, 1000]);
	});

	test('Velocity passed to overdamped spring', () => {
		const settings = {
			keyframes: [100, 1000],
			stiffness: 300,
			damping: 100,
			restSpeed: 10,
			restDelta: 0.5,
		};

		const noVelocity = animateSync(spring(settings), 200);
		const velocity = animateSync(spring({ ...settings, velocity: 1000 }), 200);

		expect(noVelocity).not.toEqual(velocity);
	});

	test('Spring defined with bounce and duration is same as just bounce', () => {
		const settings = {
			keyframes: [100, 1000],
			bounce: 0.1,
		};

		const withoutDuration = animateSync(spring(settings), 200);
		const withDuration = animateSync(spring({ ...settings, duration: 800 }), 200);

		expect(withoutDuration).toEqual(withDuration);
		// Check duration order of magnitude is correct
		expect(withoutDuration.length).toBeGreaterThan(4);
	});

	test('Time-defined spring ignores velocity', () => {
		const settings = {
			keyframes: [500, 10],
			bounce: 0.2,
			duration: 1000,
		};
		const withVelocity = spring({ ...settings, velocity: 1000 });
		const withoutVelocity = spring(settings);

		// Time-defined springs ignore velocity to prevent wild oscillation
		// from interrupted animations
		expect(withVelocity.next(0).value).toBe(withoutVelocity.next(0).value);
		expect(withVelocity.next(100).value).toBe(withoutVelocity.next(100).value);
	});

	test('Time-defined spring with velocity does not wildly oscillate', () => {
		/**
		 * Time-defined springs (duration/bounce) must ignore inherited
		 * velocity. When an animation is interrupted, the motionValue
		 * carries velocity from the in-progress animation. If this leaks
		 * into findSpring(), it changes the computed spring parameters
		 * and causes massive oscillation on small-range animations.
		 */
		const settings = {
			keyframes: [0, 100],
			bounce: 0.2,
			duration: 400,
		};

		const noVelocity = spring(settings);
		const withVelocity = spring({ ...settings, velocity: 5000 });

		let maxNoVelocity = 0;
		let maxWithVelocity = 0;

		for (let t = 0; t <= 400; t += 5) {
			const noVel = noVelocity.next(t).value;
			const withVel = withVelocity.next(t).value;

			if (noVel > maxNoVelocity) maxNoVelocity = noVel;
			if (withVel > maxWithVelocity) maxWithVelocity = withVel;
		}

		// Both should have identical mild overshoot (velocity is ignored)
		expect(maxNoVelocity - 100).toBeLessThan(5);
		expect(maxWithVelocity - 100).toBeLessThan(5);
	});

	test('Spring animating back to same number returns correct duration', () => {
		const duration = calcGeneratorDuration(
			spring({
				keyframes: [1, 1],
				velocity: 5,
				stiffness: 200,
				damping: 15,
			})
		);

		expect(duration).toBe(600);
	});
});
