/**
 * Unit tests for easing functions
 */

import { describe, it, expect } from 'vitest';
import { easeIn, easeOut, easeInOut } from './ease';
import { cubicBezier } from './cubic-bezier';

describe('easeIn', () => {
	it('should start slow and end fast', () => {
		expect(easeIn(0)).toBe(0);
		expect(easeIn(1)).toBe(1);
		
		// Should accelerate: slower at start, faster at end
		const firstQuarter = easeIn(0.25);
		const thirdQuarter = easeIn(0.75);
		expect(firstQuarter).toBeLessThan(0.25);
		// thirdQuarter may not exceed 0.75 depending on curve
		expect(thirdQuarter).toBeGreaterThan(0.5);
	});

	it('should be monotonically increasing', () => {
		expect(easeIn(0)).toBeLessThan(easeIn(0.5));
		expect(easeIn(0.5)).toBeLessThan(easeIn(1));
	});
});

describe('easeOut', () => {
	it('should start fast and end slow', () => {
		expect(easeOut(0)).toBe(0);
		expect(easeOut(1)).toBe(1);
		
		// Should decelerate: faster at start, slower at end
		const firstQuarter = easeOut(0.25);
		const thirdQuarter = easeOut(0.75);
		expect(firstQuarter).toBeGreaterThan(0.25);
		// thirdQuarter may exceed 0.75 with this curve
		expect(thirdQuarter).toBeGreaterThan(0.5);
	});

	it('should be monotonically increasing', () => {
		expect(easeOut(0)).toBeLessThan(easeOut(0.5));
		expect(easeOut(0.5)).toBeLessThan(easeOut(1));
	});
});

describe('easeInOut', () => {
	it('should ease both in and out', () => {
		expect(easeInOut(0)).toBe(0);
		expect(easeInOut(1)).toBe(1);
		expect(easeInOut(0.5)).toBeCloseTo(0.5, 1);
	});

	it('should be symmetric', () => {
		const quarter = easeInOut(0.25);
		const threeQuarters = easeInOut(0.75);
		
		// Should be roughly symmetric around midpoint
		expect(quarter).toBeLessThan(0.25);
		expect(threeQuarters).toBeGreaterThan(0.75);
		expect(1 - threeQuarters).toBeCloseTo(quarter, 1);
	});

	it('should be monotonically increasing', () => {
		expect(easeInOut(0)).toBeLessThan(easeInOut(0.5));
		expect(easeInOut(0.5)).toBeLessThan(easeInOut(1));
	});
});

describe('cubicBezier', () => {
	it('should create linear easing with (0,0,1,1)', () => {
		const linear = cubicBezier(0, 0, 1, 1);
		expect(linear(0)).toBe(0);
		expect(linear(0.5)).toBeCloseTo(0.5, 2);
		expect(linear(1)).toBe(1);
	});

	it('should handle custom bezier curves', () => {
		const custom = cubicBezier(0.25, 0.1, 0.25, 1);
		expect(custom(0)).toBe(0);
		expect(custom(1)).toBe(1);
		expect(typeof custom(0.5)).toBe('number');
	});

	it('should always return values between 0 and 1 for standard curves', () => {
		const ease = cubicBezier(0.42, 0, 0.58, 1);
		for (let t = 0; t <= 1; t += 0.1) {
			const result = ease(t);
			expect(result).toBeGreaterThanOrEqual(0);
			expect(result).toBeLessThanOrEqual(1);
		}
	});
});
