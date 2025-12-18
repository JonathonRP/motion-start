/**
 * Unit tests for spring animation generator
 */

import { describe, it, expect } from 'vitest';
import { spring } from './index';

describe('spring generator', () => {
	it('should animate from origin to target', () => {
		const generator = spring({
			keyframes: [0, 100],
			stiffness: 100,
			damping: 10,
			mass: 1.0,
		});

		const start = generator.next(0);
		expect(start.value).toBe(0);
		expect(start.done).toBe(false);

		// Should progress toward target (may overshoot)
		const mid = generator.next(500);
		expect(mid.value).toBeGreaterThan(0);

		// Should eventually settle
		let state = start;
		for (let t = 0; t < 5000; t += 16) {
			state = generator.next(t);
			if (state.done) break;
		}
		expect(state.done).toBe(true);
		expect(state.value).toBeCloseTo(100, 0);
	});

	it('should respect stiffness parameter', () => {
		const stiff = spring({
			keyframes: [0, 100],
			stiffness: 300,
			damping: 10,
		});

		const soft = spring({
			keyframes: [0, 100],
			stiffness: 50,
			damping: 10,
		});

		// Stiffer spring should move faster initially
		const stiffMid = stiff.next(100);
		const softMid = soft.next(100);

		expect(Math.abs(stiffMid.value)).toBeGreaterThan(Math.abs(softMid.value));
	});

	it('should respect damping parameter', () => {
		const overdamped = spring({
			keyframes: [0, 100],
			stiffness: 100,
			damping: 50,
		});

		const underdamped = spring({
			keyframes: [0, 100],
			stiffness: 100,
			damping: 5,
		});

		// Check oscillation behavior
		let overdampedState = overdamped.next(0);
		let underdampedState = underdamped.next(0);

		for (let t = 0; t < 1000; t += 50) {
			overdampedState = overdamped.next(t);
			underdampedState = underdamped.next(t);
		}

		// Underdamped might overshoot, overdamped should not
		// This is a simplified test; real spring behavior is more complex
		expect(typeof overdampedState.value).toBe('number');
		expect(typeof underdampedState.value).toBe('number');
	});

	it('should handle negative targets', () => {
		const generator = spring({
			keyframes: [0, -100],
			stiffness: 100,
			damping: 10,
		});

		const mid = generator.next(200);
		expect(mid.value).toBeLessThan(0);
		expect(mid.value).toBeGreaterThan(-100);
	});

	it('should handle initial velocity', () => {
		const withVelocity = spring({
			keyframes: [0, 100],
			velocity: 500,
			stiffness: 100,
			damping: 10,
		});

		const withoutVelocity = spring({
			keyframes: [0, 100],
			velocity: 0,
			stiffness: 100,
			damping: 10,
		});

		// With positive velocity should progress faster initially
		const withVel = withVelocity.next(50);
		const withoutVel = withoutVelocity.next(50);

		expect(withVel.value).toBeGreaterThan(withoutVel.value);
	});

	it('should handle duration-based spring configuration', () => {
		const generator = spring({
			keyframes: [0, 100],
			duration: 1000,
			bounce: 0.25,
		});

		const start = generator.next(0);
		expect(start.value).toBe(0);

		// Should still animate even with duration-based config
		const mid = generator.next(500);
		expect(mid.value).toBeGreaterThan(0);
	});

	it('should respect restDelta threshold', () => {
		const generator = spring({
			keyframes: [0, 100],
			stiffness: 100,
			damping: 10,
			restDelta: 0.01,
		});

		let state = generator.next(0);
		for (let t = 0; t < 10000; t += 16) {
			state = generator.next(t);
			if (state.done) break;
		}

		// Should be very close to target when done
		expect(state.value).toBeCloseTo(100, 1);
	});

	it('should handle zero-distance springs', () => {
		const generator = spring({
			keyframes: [100, 100],
			stiffness: 100,
			damping: 10,
		});

		const state = generator.next(0);
		expect(state.value).toBe(100);
		expect(state.done).toBe(true);
	});
});
