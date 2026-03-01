/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { mix } from '../index';

describe('mix', () => {
	describe('immediate form (with progress)', () => {
		test('mixes two numbers immediately', () => {
			expect(mix(0, 100, 0)).toBe(0);
			expect(mix(0, 100, 0.5)).toBe(50);
			expect(mix(0, 100, 1)).toBe(100);
		});
	});

	describe('curried form (returns mixer function)', () => {
		test('returns a mixer function for numbers', () => {
			const mixer = mix(0, 100);
			expect(mixer(0)).toBe(0);
			expect(mixer(0.5)).toBe(50);
			expect(mixer(1)).toBe(100);
		});

		test('returns a mixer function for colors', () => {
			const mixer = mix('#000000', '#ffffff');
			expect(mixer(0)).toBe('rgba(0, 0, 0, 1)');
			expect(mixer(1)).toBe('rgba(255, 255, 255, 1)');
		});

		test('returns a mixer function for complex strings', () => {
			const mixer = mix('0px', '100px');
			expect(mixer(0)).toBe('0px');
			expect(mixer(0.5)).toBe('50px');
			expect(mixer(1)).toBe('100px');
		});

		test('returns a mixer function for arrays', () => {
			const mixer = mix([0, 0], [100, 100]);
			expect(mixer(0)).toEqual([0, 0]);
			expect(mixer(0.5)).toEqual([50, 50]);
			expect(mixer(1)).toEqual([100, 100]);
		});

		test('returns a mixer function for objects', () => {
			const mixer = mix({ x: 0, y: 0 }, { x: 100, y: 100 });
			expect(mixer(0)).toEqual({ x: 0, y: 0 });
			expect(mixer(0.5)).toEqual({ x: 50, y: 50 });
			expect(mixer(1)).toEqual({ x: 100, y: 100 });
		});
	});
});
