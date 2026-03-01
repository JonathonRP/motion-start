/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { pipe } from '../pipe';

describe('pipe', () => {
	test('composes functions left to right', () => {
		const addOne = (x: number) => x + 1;
		const double = (x: number) => x * 2;

		// pipe(addOne, double)(5) = double(addOne(5)) = double(6) = 12
		const composed = pipe(addOne, double);
		expect(composed(5)).toBe(12);
	});

	test('handles single function', () => {
		const addOne = (x: number) => x + 1;
		const composed = pipe(addOne);
		expect(composed(5)).toBe(6);
	});

	test('handles multiple functions', () => {
		const addOne = (x: number) => x + 1;
		const double = (x: number) => x * 2;
		const square = (x: number) => x * x;

		// pipe(addOne, double, square)(3) = square(double(addOne(3))) = square(double(4)) = square(8) = 64
		const composed = pipe(addOne, double, square);
		expect(composed(3)).toBe(64);
	});

	test('works with string transformers', () => {
		const toUpper = (s: string) => s.toUpperCase();
		const exclaim = (s: string) => s + '!';

		const composed = pipe(toUpper, exclaim);
		expect(composed('hello')).toBe('HELLO!');
	});
});
