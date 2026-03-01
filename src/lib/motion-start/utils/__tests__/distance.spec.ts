/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { distance, distance2D } from '../distance';

describe('distance', () => {
	test('calculates distance between two numbers', () => {
		expect(distance(-100, 100)).toBe(200);
		expect(distance(100, -100)).toBe(200);
	});

	test('returns the correct distance between two 2D points', () => {
		expect(
			distance2D(
				{
					x: 0,
					y: 0,
				},
				{
					x: 1,
					y: 1,
				}
			)
		).toBe(1.4142135623730951);
	});
});
