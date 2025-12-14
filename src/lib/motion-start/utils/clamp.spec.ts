/**
 * Unit tests for clamp utility
 */

import { describe, it, expect } from 'vitest';
import { clamp } from './clamp';

describe('clamp', () => {
	it('should clamp value above max to max', () => {
		const result = clamp(0, 100, 150);
		expect(result).toBe(100);
	});

	it('should clamp value below min to min', () => {
		const result = clamp(0, 100, -50);
		expect(result).toBe(0);
	});

	it('should return value within range unchanged', () => {
		const result = clamp(0, 100, 50);
		expect(result).toBe(50);
	});

	it('should handle negative ranges', () => {
		const result = clamp(-100, -50, -75);
		expect(result).toBe(-75);
	});

	it('should clamp at exact boundaries', () => {
		expect(clamp(0, 100, 0)).toBe(0);
		expect(clamp(0, 100, 100)).toBe(100);
	});

	it('should handle decimal values', () => {
		const result = clamp(0, 1, 0.5);
		expect(result).toBe(0.5);
	});

	it('should handle reversed min/max (min > max)', () => {
		const result = clamp(100, 0, 50);
		// When min > max, clamps to max (edge case)
		expect(result).toBe(0);
	});
});
