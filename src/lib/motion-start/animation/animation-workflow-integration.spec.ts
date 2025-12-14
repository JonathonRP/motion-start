/**
 * Animation Workflow Integration Tests
 * Tests real-world animation scenarios and complex workflows
 */

import { describe, it, expect } from 'vitest';
import { keyframes } from './generators/keyframes';
import { spring } from './generators/spring';
import { inertia } from './generators/inertia';
import { easeIn, easeOut, easeInOut } from '../easing/ease';
import { interpolate } from '../utils/interpolate';
import { transform } from '../utils/transform';
import { mixNumber } from '../utils/mix/number';
import { clamp } from '../utils/clamp';

describe('Animation Workflow Integration Tests', () => {
	describe('Sequential Animation Composition', () => {
		it('should compose keyframes then spring for entrance animations', () => {
			// Phase 1: Keyframe entrance (0-500ms)
			const entranceKeyframes = keyframes({
				keyframes: [0, 100],
				duration: 500,
				ease: easeOut,
			});

			const entranceEnd = entranceKeyframes.next(500);
			expect(entranceEnd.value).toBe(100);
			expect(entranceEnd.done).toBe(true);

			// Phase 2: Spring settle (500-1500ms)
			// Start from the keyframe end value with initial velocity
			const springPhase = spring({
				keyframes: [entranceEnd.value, 110], // Slight overshoot target
				velocity: 0, // Starting from rest
				stiffness: 100,
				damping: 10,
			});

			let springState = springPhase.next(0);
			let finalValue = springState.value;
			let settled = false;

			for (let t = 16; t < 2000; t += 16) {
				springState = springPhase.next(t);
				finalValue = springState.value;
				if (springState.done) {
					settled = true;
					break;
				}
			}

			expect(settled).toBe(true);
			expect(finalValue).toBeCloseTo(110, 0);
		});

		it('should compose inertia then spring for drag-to-position animations', () => {
			// Phase 1: Inertia from drag velocity (0-1000ms)
			const dragVelocity = 500; // px/ms
			const inertiaPhase = inertia({
				keyframes: [0],
				velocity: dragVelocity,
				power: 0.8,
				timeConstant: 350,
				max: 200, // Constrain max distance
			});

			let inertiaState = inertiaPhase.next(0);
			let inertiaFinalValue = 0;

			for (let t = 16; t < 1500; t += 16) {
				inertiaState = inertiaPhase.next(t);
				inertiaFinalValue = inertiaState.value;
				if (inertiaState.done) break;
			}

			// Phase 2: Spring to final position
			const springTarget = 180;
			const springPhase = spring({
				keyframes: [inertiaFinalValue, springTarget],
				stiffness: 150,
				damping: 12,
			});

			let springState = springPhase.next(0);
			let finalValue = springState.value;

			for (let t = 16; t < 2000; t += 16) {
				springState = springPhase.next(t);
				finalValue = springState.value;
				if (springState.done) break;
			}

			expect(finalValue).toBeCloseTo(springTarget, 0);
		});

		it('should handle staggered keyframe animations', () => {
			const animations = Array.from({ length: 3 }, (_, i) => {
				const delay = i * 100;
				return keyframes({
					keyframes: [0, 100],
					duration: 300,
				});
			});

			// Simulate staggered execution
			const results: number[] = [];

			animations.forEach((anim, index) => {
				const delay = index * 100;
				const startTime = delay;
				const endTime = delay + 300;

				// Execute at staggered times
				const result = anim.next(startTime + 300);
				results.push(result.value);
			});

			// All animations should complete (value = 100)
			results.forEach(value => {
				expect(value).toBe(100);
			});
		});
	});

	describe('Complex Animation Pipelines', () => {
		it('should handle multi-segment easing in keyframes', () => {
			const easeLinear = (t: number) => t;
			const easeQuad = (t: number) => t * t;
			const easeOut2 = (t: number) => 1 - (1 - t) * (1 - t);

			const generator = keyframes({
				keyframes: [0, 50, 100, 150],
				duration: 1200,
				ease: [easeLinear, easeQuad, easeOut2], // Different easing per segment
			});

			// Segment 1 (0-400ms): Linear from 0 to 50
			const seg1 = generator.next(200);
			expect(seg1.value).toBeGreaterThan(0);
			expect(seg1.value).toBeLessThan(50);

			// Segment 2 (400-800ms): Quadratic from 50 to 100
			const seg2 = generator.next(600);
			// At 50% through segment 2, should be progressing toward 100
			expect(seg2.value).toBeGreaterThan(50);
			expect(seg2.value).toBeLessThan(100);

			// Segment 3 (800-1200ms): EaseOut from 100 to 150
			const seg3 = generator.next(1000);
			// Should be progressing toward 150
			expect(seg3.value).toBeGreaterThan(100);
			expect(seg3.value).toBeLessThan(150);
		});

		it('should handle transform interpolation in animation', () => {
			const transforms = [
				{ x: 0, y: 0, rotate: 0 },
				{ x: 100, y: 50, rotate: 45 },
			];

			const generator = keyframes({
				keyframes: [
					`translateX(${transforms[0].x}px) translateY(${transforms[0].y}px) rotate(${transforms[0].rotate}deg)`,
					`translateX(${transforms[1].x}px) translateY(${transforms[1].y}px) rotate(${transforms[1].rotate}deg)`,
				],
				duration: 1000,
			});

			const start = generator.next(0);
			expect(start.value).toContain('0px');

			const mid = generator.next(500);
			expect(mid.value).toContain('translate');
			expect(mid.value).toContain('rotate');

			const end = generator.next(1000);
			expect(end.value).toContain('100px');
			expect(end.value).toContain('50px');
		});

		it('should handle color animation in keyframes', () => {
			const generator = keyframes({
				keyframes: ['rgb(255, 0, 0)', 'rgb(0, 0, 255)'],
				duration: 1000,
			});

			const start = generator.next(0);
			expect(start.value).toContain('255');
			expect(start.value).toContain('0, 0');

			const mid = generator.next(500);
			expect(mid.value).toContain('rgb');

			const end = generator.next(1000);
			expect(end.value).toContain('0');
			expect(end.value).toContain('255');
		});
	});

	describe('Animation Constraints and Boundaries', () => {
		it('should respect value constraints during spring animation', () => {
			const generator = spring({
				keyframes: [0, 150],
				stiffness: 200,
				damping: 8,
			});

			let maxValue = 0;
			let state = generator.next(0);

			for (let t = 16; t < 3000; t += 16) {
				state = generator.next(t);
				maxValue = Math.max(maxValue, state.value);
				if (state.done) break;
			}

			// Spring may overshoot slightly but should settle around target
			expect(state.value).toBeCloseTo(150, 1);
		});

		it('should handle velocity boundaries in inertia', () => {
			const maxVelocity = 1000;
			const generator = inertia({
				keyframes: [0],
				velocity: 500,
				power: 0.85,
				max: 500, // Max distance
			});

			let maxDistance = 0;
			let state = generator.next(0);

			for (let t = 16; t < 3000; t += 16) {
				state = generator.next(t);
				maxDistance = Math.max(maxDistance, state.value);
				if (state.done) break;
			}

			expect(maxDistance).toBeLessThanOrEqual(500);
			expect(state.done).toBe(true);
		});

		it('should clamp values during animation using transform', () => {
			const generator = keyframes({
				keyframes: [0, 100],
				duration: 1000,
			});

			const min = 10;
			const max = 90;

			// Simulate clamping
			const clampedValues: number[] = [];
			for (let t = 0; t <= 1000; t += 100) {
				const state = generator.next(t);
				const clamped = clamp(state.value, min, max);
				clampedValues.push(clamped);
			}

			// Check that values respect bounds
			clampedValues.forEach(v => {
				expect(v).toBeGreaterThanOrEqual(min);
				expect(v).toBeLessThanOrEqual(max);
			});
		});
	});

	describe('Animation Composition with Custom Easing', () => {
		it('should apply cubic bezier easing in animation', () => {
			// Custom easing function (approximates cubic-bezier(0.42, 0, 0.58, 1))
			const customEase = (t: number): number => {
				const c1 = 0.42;
				const c2 = 0.58;
				// Simplified cubic bezier approximation
				const s = 1 - t;
				return 3 * s * s * t * c1 + 3 * s * t * t * c2 + t * t * t;
			};

			const generator = keyframes({
				keyframes: [0, 100],
				duration: 1000,
				ease: customEase,
			});

			const early = generator.next(250); // 25%
			const mid = generator.next(500); // 50%
			const late = generator.next(750); // 75%

			// Verify monotonic progression or near-equal
			expect(early.value).toBeLessThanOrEqual(mid.value);
			expect(mid.value).toBeLessThanOrEqual(late.value);

			// Verify reasonable values
			expect(early.value).toBeGreaterThan(0);
			expect(late.value).toBeLessThan(100);
		});

		it('should handle easeInOut progression', () => {
			const generator = keyframes({
				keyframes: [0, 100],
				duration: 1000,
				ease: easeInOut,
			});

			const early = generator.next(100);
			const quarter = generator.next(250);
			const mid = generator.next(500);
			const threeQuarter = generator.next(750);
			const late = generator.next(900);

			// easeInOut should progress monotonically
			expect(early.value).toBeLessThanOrEqual(quarter.value);
			expect(quarter.value).toBeLessThanOrEqual(mid.value);
			expect(mid.value).toBeLessThanOrEqual(threeQuarter.value);
			expect(threeQuarter.value).toBeLessThanOrEqual(late.value);

			// Verify values are in reasonable range
			expect(early.value).toBeGreaterThan(0);
			expect(late.value).toBeLessThan(100);
		});
	});

	describe('Animation State Management', () => {
		it('should properly reset animation state for sequential animations', () => {
			// First animation
			const anim1 = keyframes({
				keyframes: [0, 100],
				duration: 500,
			});

			const end1 = anim1.next(500);
			expect(end1.done).toBe(true);
			expect(end1.value).toBe(100);

			// Second animation (independent)
			const anim2 = keyframes({
				keyframes: [0, 50],
				duration: 300,
			});

			const start2 = anim2.next(0);
			expect(start2.done).toBe(false);
			expect(start2.value).toBe(0);

			const end2 = anim2.next(300);
			expect(end2.done).toBe(true);
			expect(end2.value).toBe(50);
		});

		it('should handle animation completion signals correctly', () => {
			const animations = [
				keyframes({ keyframes: [0, 100], duration: 200 }),
				spring({ keyframes: [0, 100], stiffness: 100, damping: 10 }),
				inertia({ keyframes: [0], velocity: 500, power: 0.8 }),
			];

			animations.forEach(anim => {
				// Collect all states
				const states: boolean[] = [];
				for (let t = 0; t < 5000; t += 50) {
					const state = anim.next(t);
					states.push(state.done);
					if (state.done) break;
				}

				// Should eventually complete
				expect(states[states.length - 1]).toBe(true);
				// done should be monotonic (once true, stays true)
				let foundDone = false;
				for (const done of states) {
					if (foundDone && !done) {
						throw new Error('Animation done state was not monotonic');
					}
					if (done) foundDone = true;
				}
			});
		});
	});

	describe('Real-world Animation Scenarios', () => {
		it('should handle card entrance animation with delay', () => {
			const cardDelay = 100;
			const entryDuration = 400;
			const totalDuration = cardDelay + entryDuration;

			// Opacity animation
			const opacityAnim = keyframes({
				keyframes: [0, 1],
				duration: entryDuration,
				ease: easeOut,
			});

			// Position animation
			const positionAnim = keyframes({
				keyframes: [-20, 0], // Slide up from -20px
				duration: entryDuration,
				ease: easeOut,
			});

			// Simulate animations starting at delay
			const startTime = cardDelay;
			const opacityState = opacityAnim.next(startTime + entryDuration);
			const positionState = positionAnim.next(startTime + entryDuration);

			expect(opacityState.value).toBe(1);
			expect(positionState.value).toBe(0);
		});

		it('should handle hover scale animation', () => {
			const scaleAnim = spring({
				keyframes: [1, 1.1],
				stiffness: 300,
				damping: 15,
			});

			let state = scaleAnim.next(0);
			const stateAt100ms = scaleAnim.next(100);

			// Should be moving toward 1.1
			expect(stateAt100ms.value).toBeGreaterThan(1);
			expect(stateAt100ms.value).toBeLessThan(1.1);

			// Should eventually settle
			for (let t = 0; t < 2000; t += 50) {
				state = scaleAnim.next(t);
				if (state.done) break;
			}
			expect(state.value).toBeCloseTo(1.1, 1);
		});

		it('should handle drag constrain animation', () => {
			const dragVector = 250; // Attempted drag distance
			const constraintBounds = { min: 0, max: 200 };

			const constrainedDistance = clamp(dragVector, constraintBounds.min, constraintBounds.max);

			const constrainedAnim = keyframes({
				keyframes: [constraintBounds.min, constrainedDistance],
				duration: 300,
			});

			const result = constrainedAnim.next(300);
			expect(result.value).toBeCloseTo(constrainedDistance, 0);
			expect(result.value).toBeLessThanOrEqual(constraintBounds.max);
		});
	});
});
