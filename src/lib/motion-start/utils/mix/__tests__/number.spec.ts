/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { mixNumber } from '../number';

describe('mixNumber', () => {
	test('mixes between two numbers', () => {
		expect(mixNumber(0, 100, 0)).toBe(0);
		expect(mixNumber(0, 100, 0.5)).toBe(50);
		expect(mixNumber(0, 100, 1)).toBe(100);
	});

	test('handles negative numbers', () => {
		expect(mixNumber(-100, 100, 0)).toBe(-100);
		expect(mixNumber(-100, 100, 0.5)).toBe(0);
		expect(mixNumber(-100, 100, 1)).toBe(100);
	});

	test('extrapolates beyond 0-1 range', () => {
		expect(mixNumber(0, 100, -0.5)).toBe(-50);
		expect(mixNumber(0, 100, 1.5)).toBe(150);
	});

	test('handles equal from and to values', () => {
		expect(mixNumber(50, 50, 0)).toBe(50);
		expect(mixNumber(50, 50, 0.5)).toBe(50);
		expect(mixNumber(50, 50, 1)).toBe(50);
	});
});
