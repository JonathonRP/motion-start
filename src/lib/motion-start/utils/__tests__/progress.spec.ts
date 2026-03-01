/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { progress } from '../progress';

describe('progress', () => {
	test('returns progress of value within range', () => {
		expect(progress(0, 100, 0)).toBe(0);
		expect(progress(0, 100, 50)).toBe(0.5);
		expect(progress(0, 100, 100)).toBe(1);
	});

	test('handles values outside range', () => {
		expect(progress(0, 100, -50)).toBe(-0.5);
		expect(progress(0, 100, 150)).toBe(1.5);
	});

	test('handles negative ranges', () => {
		expect(progress(-100, 0, -50)).toBe(0.5);
		expect(progress(-100, 100, 0)).toBe(0.5);
	});

	test('returns 1 when from equals to', () => {
		expect(progress(50, 50, 50)).toBe(1);
		expect(progress(50, 50, 100)).toBe(1);
	});
});
