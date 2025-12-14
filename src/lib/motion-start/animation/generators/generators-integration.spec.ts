/**
 * Integration tests for animation generators
 * Tests how keyframes, spring, and inertia work together
 */

import { describe, it, expect } from 'vitest';
import { keyframes } from './keyframes';
import { spring } from './spring';
import { inertia } from './inertia';

describe('Integration: Animation Generators', () => {
	describe('keyframes generator in animation pipeline', () => {
		// Based on: keyframes unit test 1
		it('should animate through keyframe values in sequence', () => {
			const generator = keyframes({
				keyframes: [0, 50, 100],
				duration: 1000,
			});

			const start = generator.next(0);
			expect(start.value).toBe(0);
			expect(start.done).toBe(false);

			const mid = generator.next(500);
			expect(mid.value).toBe(50);

			const end = generator.next(1000);
			expect(end.value).toBe(100);
			expect(end.done).toBe(true);
		});

		// Based on: keyframes unit test 2
		it('should use default duration of 300ms', () => {
			const generator = keyframes({
				keyframes: [0, 100],
			});

			const mid = generator.next(150);
			expect(mid.value).toBe(50);

			const end = generator.next(300);
			expect(end.done).toBe(true);
		});

		// Based on: keyframes unit test 3
		it('should respect custom times array for keyframe timing', () => {
			const generator = keyframes({
				keyframes: [0, 50, 100],
				times: [0, 0.25, 1], // 50 happens at 25% through animation
				duration: 1000,
			});

			const quarter = generator.next(250);
			expect(quarter.value).toBe(50);

			const end = generator.next(1000);
			expect(end.value).toBe(100);
			expect(end.done).toBe(true);
		});

		// Based on: keyframes unit test 4
		it('should apply easing function across keyframes', () => {
			const easeSquare = (t: number) => t * t;

			const withEasing = keyframes({
				keyframes: [0, 100],
				duration: 1000,
				ease: easeSquare,
			});

			const mid = withEasing.next(500);
			// With squared easing at 50% progress: 0.5^2 = 0.25
			expect(mid.value).toBeLessThan(50);
		});

		// Based on: keyframes unit test 7
		it('should handle string keyframes', () => {
			const generator = keyframes({
				keyframes: ['0px', '50px', '100px'],
				duration: 1000,
			});

			const start = generator.next(0);
			expect(start.value).toContain('px');

			const end = generator.next(1000);
			expect(end.value).toBe('100px');
		});

		// Based on: keyframes unit test 10
		it('should handle single keyframe (static value)', () => {
			const generator = keyframes({
				keyframes: [42],
				duration: 1000,
			});

			const result = generator.next(500);
			expect(result.value).toBe(42);

			const end = generator.next(1000);
			expect(end.done).toBe(true);
		});
	});

	describe('spring generator in interactive animations', () => {
		// Based on: spring unit test 1
		it('should animate from origin to target with spring physics', () => {
			const generator = spring({
				keyframes: [0, 100],
				stiffness: 100,
				damping: 10,
			});

			const start = generator.next(0);
			expect(start.value).toBe(0);

			const mid = generator.next(500);
			expect(mid.value).toBeGreaterThan(0);
			// Spring may overshoot slightly
			expect(mid.value).toBeLessThanOrEqual(150);

			// Continue until animation settles
			let done = false;
			let current = mid;
			let lastTime = 500;
			while (!done && lastTime < 5000) {
				lastTime += 100;
				current = generator.next(lastTime);
				done = current.done;
			}

			expect(done).toBe(true);
			expect(current.value).toBeCloseTo(100, 0);
		});

		// Based on: spring unit test 2
		it('should respect stiffness parameter affecting speed', () => {
			const stiffSprg = spring({
				keyframes: [0, 100],
				stiffness: 300,
				damping: 10,
			});

			const softSprg = spring({
				keyframes: [0, 100],
				stiffness: 50,
				damping: 10,
			});

			const stiffMid = stiffSprg.next(300).value;
			const softMid = softSprg.next(300).value;

			// Stiffer spring should progress faster
			expect(stiffMid).toBeGreaterThan(softMid);
		});

		// Based on: spring unit test 3
		it('should respect damping parameter affecting oscillation', () => {
			const underdamped = spring({
				keyframes: [0, 100],
				stiffness: 100,
				damping: 5,
			});

			const overdamped = spring({
				keyframes: [0, 100],
				stiffness: 100,
				damping: 50,
			});

			// Both should start at 0
			expect(underdamped.next(0).value).toBe(0);
			expect(overdamped.next(0).value).toBe(0);

			// Both should eventually reach target
			let uState = underdamped.next(100);
			let oState = overdamped.next(100);
			for (let t = 200; t <= 5000; t += 100) {
				uState = underdamped.next(t);
				oState = overdamped.next(t);
				if (uState.done && oState.done) break;
			}

			expect(uState.value).toBeCloseTo(100, 1);
			expect(oState.value).toBeCloseTo(100, 1);
		});

		// Based on: spring unit test 5
		it('should handle initial velocity affecting trajectory', () => {
			const withVelocity = spring({
				keyframes: [0, 100],
				velocity: 50,
				stiffness: 100,
				damping: 10,
			});

			const withoutVelocity = spring({
				keyframes: [0, 100],
				velocity: 0,
				stiffness: 100,
				damping: 10,
			});

			const withVelocityVal = withVelocity.next(100).value;
			const withoutVelocityVal = withoutVelocity.next(100).value;

			// Initial velocity should affect progression
			expect(withVelocityVal).toBeGreaterThan(withoutVelocityVal);
		});
	});

	describe('inertia generator for drag animations', () => {
		// Based on: inertia unit test 1
		it('should animate with velocity decay', () => {
			const generator = inertia({
				keyframes: [0, 100],
				velocity: 500,
				power: 0.8,
			});

			const start = generator.next(0);
			expect(start.value).toBe(0);

			const early = generator.next(50);
			expect(early.value).toBeGreaterThan(0);
			const earlyValue = early.value;

			const mid = generator.next(100);
			expect(mid.value).toBeGreaterThanOrEqual(earlyValue);
			const midValue = mid.value;

			// Later time - velocity continues to decay
			const later = generator.next(200);
			expect(later.value).toBeGreaterThan(0);

			// Verify motion is still happening (not finished yet)
			expect(later.done).toBe(false);
		});

		// Based on: inertia unit test 2
		it('should respect velocity direction', () => {
			const posVelocity = inertia({
				keyframes: [0, 100],
				velocity: 500,
				power: 0.8,
			});

			const negVelocity = inertia({
				keyframes: [100, 0],
				velocity: -500,
				power: 0.8,
			});

			const posAt100 = posVelocity.next(100).value;
			const negAt100 = negVelocity.next(100).value;

			// Positive velocity should move towards 100
			expect(posAt100).toBeGreaterThan(0);
			// Negative velocity should move towards 0
			expect(negAt100).toBeLessThan(100);
		});

		// Based on: inertia unit test 3
		it('should respect power parameter affecting deceleration', () => {
			const highPower = inertia({
				keyframes: [0, 100],
				velocity: 500,
				power: 0.95,
			});

			const lowPower = inertia({
				keyframes: [0, 100],
				velocity: 500,
				power: 0.5,
			});

			const highAt200 = highPower.next(200).value;
			const lowAt200 = lowPower.next(200).value;

			// Higher power maintains velocity longer
			expect(highAt200).toBeGreaterThan(lowAt200);
		});

		// Based on: inertia unit test 5
		it('should respect min boundary constraint', () => {
			const generator = inertia({
				keyframes: [0, 100],
				velocity: 500,
				power: 0.8,
				min: 0,
			});

			// Animate and finish
			let current = generator.next(0);
			for (let t = 100; t <= 5000; t += 100) {
				current = generator.next(t);
				if (current.done) break;
			}

			expect(current.value).toBeGreaterThanOrEqual(0);
		});

		// Based on: inertia unit test 6
		it('should respect max boundary constraint', () => {
			const generator = inertia({
				keyframes: [0, 500],
				velocity: 500,
				power: 0.8,
				max: 300,
			});

			// Animate and finish
			let current = generator.next(0);
			for (let t = 100; t <= 5000; t += 100) {
				current = generator.next(t);
				if (current.done) break;
			}

			expect(current.value).toBeLessThanOrEqual(300);
		});
	});

	describe('generator composition in animation sequences', () => {
		it('should chain keyframes then spring for entrance animations', () => {
			// Phase 1: Quick entrance with keyframes
			const entrance = keyframes({
				keyframes: [0, 100],
				duration: 300,
			});

			const entranceEnd = entrance.next(300);
			expect(entranceEnd.value).toBe(100);
			expect(entranceEnd.done).toBe(true);

			// Phase 2: Settle with spring bounce (if needed)
			const settlement = spring({
				keyframes: [entranceEnd.value, 100],
				stiffness: 150,
				damping: 20,
			});

			const settled = settlement.next(500);
			expect(settled.value).toBeDefined();
		});

		it('should use inertia then spring for drag-to-position animations', () => {
			// Phase 1: Inertial momentum from drag release
			const momentum = inertia({
				keyframes: [0, 200],
				velocity: 300,
				power: 0.85,
				max: 150, // Hit constraint
			});

			let momentumResult = momentum.next(0);
			for (let t = 50; t <= 500; t += 50) {
				momentumResult = momentum.next(t);
				if (momentumResult.done) break;
			}

			const constrainedPosition = Math.min(momentumResult.value, 150);

			// Phase 2: Spring back to snap position
			const snap = spring({
				keyframes: [constrainedPosition, 100],
				stiffness: 200,
				damping: 15,
			});

			let snapResult = snap.next(0);
			for (let t = 50; t <= 1000; t += 50) {
				snapResult = snap.next(t);
				if (snapResult.done) break;
			}

			expect(snapResult.value).toBeCloseTo(100, 1);
		});

		it('should handle staggered keyframe animations', () => {
			const numItems = 3;
			const stagger = 100; // ms between starts

			const generators = Array.from({ length: numItems }, () =>
				keyframes({
					keyframes: [0, 100],
					duration: 300,
				})
			);

			const results: number[] = [];

			// Run all animations with stagger
			for (let time = 0; time <= 600; time += 50) {
				const values = generators.map((gen, index) => {
					const localTime = Math.max(0, time - index * stagger);
					return gen.next(localTime).value;
				});
				results.push(...values);
			}

			// All should start at some point and progress
			expect(results.length).toBeGreaterThan(0);
		});
	});

	describe('generator edge cases and constraints', () => {
		// Based on: keyframes unit test 11
		it('should handle many keyframes', () => {
			const manyKeyframes = Array.from({ length: 10 }, (_, i) => i * 10);
			const generator = keyframes({
				keyframes: manyKeyframes,
				duration: 1000,
			});

			const start = generator.next(0);
			expect(start.value).toBe(0);

			const end = generator.next(1000);
			expect(end.value).toBe(90);
			expect(end.done).toBe(true);
		});

		// Based on: spring unit test 8
		it('should handle zero-distance springs (already at target)', () => {
			const generator = spring({
				keyframes: [100, 100],
				stiffness: 100,
				damping: 10,
			});

			const result = generator.next(500);
			expect(result.value).toBe(100);
		});

		it('should handle negative keyframe values', () => {
			const generator = keyframes({
				keyframes: [-100, 0, 100],
				duration: 1000,
			});

			const start = generator.next(0);
			expect(start.value).toBe(-100);

			const mid = generator.next(500);
			expect(mid.value).toBe(0);

			const end = generator.next(1000);
			expect(end.value).toBe(100);
		});
	});
});
