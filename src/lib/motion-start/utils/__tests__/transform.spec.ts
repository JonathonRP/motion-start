/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { transform } from '../transform';

describe('transform', () => {
	describe('immediate form', () => {
		test('transforms a value from input range to output range', () => {
			expect(transform(100, [0, 200], [0, 1])).toBe(0.5);
		});

		test('clamps values by default', () => {
			expect(transform(-50, [0, 200], [0, 1])).toBe(0);
			expect(transform(250, [0, 200], [0, 1])).toBe(1);
		});

		test('does not clamp when clamp is false', () => {
			expect(transform(-50, [0, 200], [0, 1], { clamp: false })).toBe(-0.25);
			expect(transform(250, [0, 200], [0, 1], { clamp: false })).toBe(1.25);
		});
	});

	describe('curried form', () => {
		test('returns a function that transforms values', () => {
			const converter = transform([0, 200], [0, 1]);
			expect(converter(100)).toBe(0.5);
		});

		test('clamps values by default', () => {
			const converter = transform([0, 200], [0, 1]);
			expect(converter(-50)).toBe(0);
			expect(converter(250)).toBe(1);
		});

		test('handles complex ranges', () => {
			const converter = transform([-200, -100, 100, 200], [0, 1, 1, 0]);
			expect(converter(-200)).toBe(0);
			expect(converter(-150)).toBe(0.5);
			expect(converter(-100)).toBe(1);
			expect(converter(0)).toBe(1);
			expect(converter(100)).toBe(1);
			expect(converter(150)).toBe(0.5);
			expect(converter(200)).toBe(0);
		});
	});

	describe('output types', () => {
		test('transforms numbers', () => {
			expect(transform(0.5, [0, 1], [0, 100])).toBe(50);
		});

		test('transforms strings with units', () => {
			expect(transform(0.5, [0, 1], ['0px', '100px'])).toBe('50px');
		});
	});
});
