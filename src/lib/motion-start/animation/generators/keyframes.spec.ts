/**
 * Unit tests for keyframes animation generator
 */

import { describe, it, expect } from 'vitest';
import { keyframes } from './keyframes';

describe('keyframes generator', () => {
	it('should animate through keyframe values', () => {
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

	it('should use default duration of 300ms', () => {
		const generator = keyframes({
			keyframes: [0, 100],
		});

		const mid = generator.next(150);
		expect(mid.value).toBe(50);

		const end = generator.next(300);
		expect(end.done).toBe(true);
	});

	it('should respect custom times array', () => {
		const generator = keyframes({
			keyframes: [0, 50, 100],
			times: [0, 0.25, 1], // 50 happens at 25% through animation
			duration: 1000,
		});

		const quarter = generator.next(250);
		expect(quarter.value).toBe(50);

		const end = generator.next(1000);
		expect(end.value).toBe(100);
	});

	it('should apply easing function', () => {
		const easeSquare = (t: number) => t * t;

		const withEasing = keyframes({
			keyframes: [0, 100],
			duration: 1000,
			ease: easeSquare,
		});

		const mid = withEasing.next(500);
		// With square easing at t=0.5, progress should be 0.25, so value should be 25
		expect(mid.value).toBeCloseTo(25, 0);
	});

	it('should apply different easing per segment', () => {
		const linear = (t: number) => t;
		const square = (t: number) => t * t;

		const generator = keyframes({
			keyframes: [0, 50, 100],
			duration: 1000,
			ease: [linear, square],
		});

		// First half should be linear
		const quarter = generator.next(250);
		expect(quarter.value).toBeCloseTo(25, 0);

		// Second half applies square easing
		const threeQuarter = generator.next(750);
		// At 750ms, we're 50% through second segment
		// Square easing at 0.5 = 0.25, so 50 + (50 * 0.25) = 62.5
		expect(threeQuarter.value).toBeCloseTo(62.5, 0);
	});

	it('should handle string keyframes', () => {
		const generator = keyframes({
			keyframes: ['0px', '100px'],
			duration: 1000,
		});

		const mid = generator.next(500);
		expect(mid.value).toBe('50px');
	});

	it('should handle color keyframes', () => {
		const generator = keyframes({
			keyframes: ['#FF0000', '#0000FF'],
			duration: 1000,
		});

		const start = generator.next(0);
		expect(start.value).toContain('255');
		expect(start.value).toContain('0');
	});

	it('should mark animation as done at duration', () => {
		const generator = keyframes({
			keyframes: [0, 100],
			duration: 500,
		});

		const beforeEnd = generator.next(499);
		expect(beforeEnd.done).toBe(false);

		const atEnd = generator.next(500);
		expect(atEnd.done).toBe(true);

		const afterEnd = generator.next(600);
		expect(afterEnd.done).toBe(true);
	});

	it('should handle single keyframe', () => {
		const generator = keyframes({
			keyframes: [100],
			duration: 1000,
		});

		const state = generator.next(500);
		expect(state.value).toBe(100);
	});

	it('should handle many keyframes', () => {
		const generator = keyframes({
			keyframes: [0, 25, 50, 75, 100],
			duration: 1000,
		});

		expect(generator.next(0).value).toBe(0);
		expect(generator.next(250).value).toBe(25);
		expect(generator.next(500).value).toBe(50);
		expect(generator.next(750).value).toBe(75);
		expect(generator.next(1000).value).toBe(100);
	});

	it('should return calculatedDuration', () => {
		const generator = keyframes({
			keyframes: [0, 100],
			duration: 1234,
		});

		expect(generator.calculatedDuration).toBe(1234);
	});
});
