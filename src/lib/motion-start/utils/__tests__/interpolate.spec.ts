/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { interpolate } from '../interpolate';

describe('interpolate', () => {
	test('interpolates between two numbers', () => {
		const interp = interpolate([0, 100], [0, 1]);
		expect(interp(0)).toBe(0);
		expect(interp(50)).toBe(0.5);
		expect(interp(100)).toBe(1);
	});

	test('clamps values by default', () => {
		const interp = interpolate([0, 100], [0, 1]);
		expect(interp(-50)).toBe(0);
		expect(interp(150)).toBe(1);
	});

	test('does not clamp values when clamp is false', () => {
		const interp = interpolate([0, 100], [0, 1], { clamp: false });
		expect(interp(-50)).toBe(-0.5);
		expect(interp(150)).toBe(1.5);
	});

	test('handles reversed input ranges', () => {
		const interp = interpolate([100, 0], [0, 1]);
		expect(interp(0)).toBe(1);
		expect(interp(50)).toBe(0.5);
		expect(interp(100)).toBe(0);
	});

	test('handles multi-segment interpolation', () => {
		const interp = interpolate([0, 50, 100], [0, 1, 0]);
		expect(interp(0)).toBe(0);
		expect(interp(25)).toBe(0.5);
		expect(interp(50)).toBe(1);
		expect(interp(75)).toBe(0.5);
		expect(interp(100)).toBe(0);
	});

	test('returns constant for single input', () => {
		const interp = interpolate([50], [10]);
		expect(interp(0)).toBe(10);
		expect(interp(100)).toBe(10);
	});

	test('returns final output for equal inputs', () => {
		const interp = interpolate([50, 50], [10, 20]);
		expect(interp(50)).toBe(20);
	});

	test('interpolates with custom easing function', () => {
		const linearEase = (t: number) => t;
		const interp = interpolate([0, 100], [0, 1], { ease: linearEase });
		expect(interp(50)).toBe(0.5);
	});

	test('interpolates strings with numbers', () => {
		const interp = interpolate([0, 100], ['0px', '100px']);
		expect(interp(0)).toBe('0px');
		expect(interp(50)).toBe('50px');
		expect(interp(100)).toBe('100px');
	});
});
