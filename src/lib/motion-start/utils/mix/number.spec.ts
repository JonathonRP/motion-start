/**
 * Unit tests for number mixing utilities
 */

import { describe, it, expect } from 'vitest';
import { mixNumber } from './number';

describe('mixNumber', () => {
	it('should mix numbers at midpoint', () => {
		const result = mixNumber(0, 100, 0.5);
		expect(result).toBe(50);
	});

	it('should return from value at progress 0', () => {
		const result = mixNumber(10, 20, 0);
		expect(result).toBe(10);
	});

	it('should return to value at progress 1', () => {
		const result = mixNumber(10, 20, 1);
		expect(result).toBe(20);
	});

	it('should handle negative numbers', () => {
		const result = mixNumber(-100, 100, 0.5);
		expect(result).toBe(0);
	});

	it('should handle negative progress (extrapolation)', () => {
		const result = mixNumber(0, 100, -0.5);
		expect(result).toBe(-50);
	});

	it('should handle progress > 1 (extrapolation)', () => {
		const result = mixNumber(0, 100, 1.5);
		expect(result).toBe(150);
	});

	it('should handle decimal precision', () => {
		const result = mixNumber(0, 1, 0.333);
		expect(result).toBeCloseTo(0.333, 3);
	});

	it('should handle same from and to values', () => {
		const result = mixNumber(50, 50, 0.5);
		expect(result).toBe(50);
	});
});
