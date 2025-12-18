/**
 * Unit tests for interpolate utility
 */

import { describe, it, expect } from 'vitest';
import { interpolate } from './interpolate';

describe('interpolate', () => {
	it('should interpolate between numeric ranges', () => {
		const transform = interpolate([0, 100], [0, 1]);
		expect(transform(0)).toBe(0);
		expect(transform(50)).toBe(0.5);
		expect(transform(100)).toBe(1);
	});

	it('should clamp by default (no extrapolation)', () => {
		const transform = interpolate([0, 100], [0, 1]);
		// Default behavior clamps values
		expect(transform(150)).toBe(1);
		expect(transform(-50)).toBe(0);
	});

	it('should clamp values when clamp option is true', () => {
		const transform = interpolate([0, 100], [0, 1], { clamp: true });
		expect(transform(150)).toBe(1);
		expect(transform(-50)).toBe(0);
	});

	it('should handle multi-segment ranges', () => {
		const transform = interpolate([0, 50, 100], [0, 1, 0]);
		expect(transform(0)).toBe(0);
		expect(transform(50)).toBe(1);
		expect(transform(100)).toBe(0);
	});

	it('should apply easing function', () => {
		const easeSquare = (t: number) => t * t;
		const transform = interpolate([0, 1], [0, 100], { ease: easeSquare });
		const result = transform(0.5);
		// With square easing, 0.5 squared is 0.25, so output should be 25
		expect(result).toBeCloseTo(25, 1);
	});

	it('should apply different easing per segment', () => {
		const linear = (t: number) => t;
		const square = (t: number) => t * t;
		const transform = interpolate([0, 50, 100], [0, 50, 100], {
			ease: [linear, square],
		});
		expect(transform(25)).toBe(25); // First segment linear
		// Second segment squared - value should be between 50 and 100
		const threeQuarter = transform(75);
		expect(threeQuarter).toBeGreaterThan(50);
		expect(threeQuarter).toBeLessThan(100);
	});

	it('should handle reverse ranges', () => {
		const transform = interpolate([0, 100], [100, 0]);
		expect(transform(0)).toBe(100);
		expect(transform(50)).toBe(50);
		expect(transform(100)).toBe(0);
	});

	it('should handle negative ranges', () => {
		const transform = interpolate([-100, 100], [-1, 1]);
		expect(transform(-100)).toBe(-1);
		expect(transform(0)).toBe(0);
		expect(transform(100)).toBe(1);
	});

	it('should work with custom mixer', () => {
		const customMixer = (from: string, to: string) => {
			return (v: number) => (v < 0.5 ? from : to);
		};
		const transform = interpolate([0, 1], ['a', 'b'], {
			mixer: customMixer,
		});
		expect(transform(0.3)).toBe('a');
		expect(transform(0.7)).toBe('b');
	});
});
