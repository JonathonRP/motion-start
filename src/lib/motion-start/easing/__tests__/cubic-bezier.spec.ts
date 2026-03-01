/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { cubicBezier } from '../cubic-bezier';
import { easeIn, easeOut, easeInOut } from '../ease';

describe('cubicBezier', () => {
	test('returns identity function for linear bezier', () => {
		const linear = cubicBezier(0, 0, 1, 1);
		// Linear bezier returns noop (identity-ish behavior)
		expect(linear(0.5)).toBeCloseTo(0.5, 5);
	});

	test('easeIn starts slow and ends fast', () => {
		// easeIn = cubicBezier(0.42, 0, 1, 1)
		expect(easeIn(0)).toBe(0);
		expect(easeIn(1)).toBe(1);
		// At midpoint, easeIn should be less than 0.5
		expect(easeIn(0.5)).toBeLessThan(0.5);
	});

	test('easeOut starts fast and ends slow', () => {
		// easeOut = cubicBezier(0, 0, 0.58, 1)
		expect(easeOut(0)).toBe(0);
		expect(easeOut(1)).toBe(1);
		// At midpoint, easeOut should be greater than 0.5
		expect(easeOut(0.5)).toBeGreaterThan(0.5);
	});

	test('easeInOut is symmetric', () => {
		// easeInOut = cubicBezier(0.42, 0, 0.58, 1)
		expect(easeInOut(0)).toBe(0);
		expect(easeInOut(1)).toBe(1);
		// At midpoint, should be approximately 0.5 (symmetric)
		expect(easeInOut(0.5)).toBeCloseTo(0.5, 1);
	});

	test('returns boundary values at t=0 and t=1', () => {
		const customEase = cubicBezier(0.25, 0.1, 0.25, 1);
		expect(customEase(0)).toBe(0);
		expect(customEase(1)).toBe(1);
	});

	test('produces monotonically increasing values for valid curves', () => {
		const ease = cubicBezier(0.25, 0.1, 0.25, 1);
		let prev = 0;
		for (let t = 0; t <= 1; t += 0.1) {
			const current = ease(t);
			expect(current).toBeGreaterThanOrEqual(prev);
			prev = current;
		}
	});
});
