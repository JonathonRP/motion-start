/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { clamp } from '../clamp';

describe('clamp', () => {
	test('returns value when within range', () => {
		expect(clamp(0, 100, 50)).toBe(50);
		expect(clamp(-10, 10, 0)).toBe(0);
	});

	test('returns min when value is below range', () => {
		expect(clamp(0, 100, -50)).toBe(0);
		expect(clamp(-10, 10, -20)).toBe(-10);
	});

	test('returns max when value is above range', () => {
		expect(clamp(0, 100, 150)).toBe(100);
		expect(clamp(-10, 10, 20)).toBe(10);
	});

	test('handles edge cases', () => {
		expect(clamp(0, 100, 0)).toBe(0);
		expect(clamp(0, 100, 100)).toBe(100);
	});
});
