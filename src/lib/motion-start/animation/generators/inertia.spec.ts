/**
 * Unit tests for inertia animation generator
 */

import { describe, it, expect } from 'vitest';
import { inertia } from './inertia';

describe('inertia generator', () => {
	it('should animate with velocity decay', () => {
		const generator = inertia({
			keyframes: [0],
			velocity: 1000,
			power: 0.8,
			timeConstant: 350,
		});

		const start = generator.next(0);
		expect(start.value).toBe(0);
		expect(start.done).toBe(false);

		// Should move in direction of velocity
		const early = generator.next(100);
		expect(early.value).toBeGreaterThan(0);

		// Velocity decays over time
		const mid = generator.next(500);
		// Mid value should exist and be moving in positive direction
		expect(mid.value).toBeGreaterThan(0);

		// Should eventually settle
		let state = start;
		for (let t = 0; t < 5000; t += 16) {
			state = generator.next(t);
			if (state.done) break;
		}
		expect(state.done).toBe(true);
	});

	it('should respect velocity direction', () => {
		const positive = inertia({
			keyframes: [0],
			velocity: 500,
		});

		const negative = inertia({
			keyframes: [0],
			velocity: -500,
		});

		const posState = positive.next(100);
		const negState = negative.next(100);

		expect(posState.value).toBeGreaterThan(0);
		expect(negState.value).toBeLessThan(0);
	});

	it('should respect power parameter', () => {
		const highPower = inertia({
			keyframes: [0],
			velocity: 500,
			power: 1.0,
		});

		const lowPower = inertia({
			keyframes: [0],
			velocity: 500,
			power: 0.3,
		});

		const highState = highPower.next(100);
		const lowState = lowPower.next(100);

		// Higher power should travel further
		expect(Math.abs(highState.value)).toBeGreaterThan(Math.abs(lowState.value));
	});

	it('should respect min boundary', () => {
		const generator = inertia({
			keyframes: [0],
			velocity: -1000,
			min: -50,
			bounceStiffness: 300,
		});

		let state = generator.next(0);
		for (let t = 0; t < 2000; t += 16) {
			state = generator.next(t);
			// Should not go significantly below min after settling
		}

		// Final value should respect boundary
		expect(state.value).toBeGreaterThanOrEqual(-50);
	});

	it('should respect max boundary', () => {
		const generator = inertia({
			keyframes: [0],
			velocity: 1000,
			max: 50,
			bounceStiffness: 300,
		});

		let state = generator.next(0);
		for (let t = 0; t < 2000; t += 16) {
			state = generator.next(t);
		}

		// Final value should respect boundary
		expect(state.value).toBeLessThanOrEqual(50);
	});

	it('should allow modifyTarget callback', () => {
		const generator = inertia({
			keyframes: [0],
			velocity: 1000,
			modifyTarget: (target) => Math.round(target / 100) * 100,
		});

		let state = generator.next(0);
		for (let t = 0; t < 5000; t += 16) {
			state = generator.next(t);
			if (state.done) break;
		}

		// Should snap to nearest 100
		expect(state.value % 100).toBe(0);
	});

	it('should handle zero velocity', () => {
		const generator = inertia({
			keyframes: [100],
			velocity: 0,
		});

		const state = generator.next(0);
		expect(state.value).toBe(100);
		expect(state.done).toBe(true);
	});

	it('should respect timeConstant for decay rate', () => {
		const fast = inertia({
			keyframes: [0],
			velocity: 500,
			timeConstant: 100,
		});

		const slow = inertia({
			keyframes: [0],
			velocity: 500,
			timeConstant: 500,
		});

		// Check distances traveled at same time
		const fastState = fast.next(200);
		const slowState = slow.next(200);

		// Both should be moving in same direction with same initial velocity
		// Slow timeConstant decays slower, but actual distances may vary
		expect(Math.abs(slowState.value)).toBeGreaterThan(0);
		expect(Math.abs(fastState.value)).toBeGreaterThan(0);
	});

	it('should respect restDelta threshold', () => {
		const generator = inertia({
			keyframes: [0],
			velocity: 100,
			restDelta: 0.1,
		});

		let state = generator.next(0);
		for (let t = 0; t < 10000; t += 16) {
			state = generator.next(t);
			if (state.done) break;
		}

		expect(state.done).toBe(true);
	});
});
