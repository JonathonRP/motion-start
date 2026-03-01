/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { scalePoint, applyPointDelta, applyAxisDelta } from '../delta-apply';

describe('scalePoint', () => {
	test('scales a point relative to an origin point', () => {
		// Point 100, scale 2, origin 50: distance from origin is 50, scaled is 100, result is 150
		expect(scalePoint(100, 2, 50)).toBe(150);
		// Point 0, scale 2, origin 50: distance from origin is -50, scaled is -100, result is -50
		expect(scalePoint(0, 2, 50)).toBe(-50);
		// Point 50, scale 2, origin 50: distance is 0, result is 50
		expect(scalePoint(50, 2, 50)).toBe(50);
	});
});

describe('applyPointDelta', () => {
	test('applies translate and scale delta to a point', () => {
		// Point 100, translate 100, scale 2, origin 50
		// First scale: scalePoint(100, 2, 50) = 150
		// Then translate: 150 + 100 = 250
		expect(applyPointDelta(100, 100, 2, 50)).toBe(250);
	});

	test('applies delta with box scale', () => {
		// Point 100, translate 0, scale 1, origin 50, boxScale 2
		// First boxScale: scalePoint(100, 2, 50) = 150
		// Then main scale: scalePoint(150, 1, 50) + 0 = 150
		expect(applyPointDelta(100, 0, 1, 50, 2)).toBe(150);
	});
});

describe('applyAxisDelta', () => {
	test('applies translate and scale delta to an axis', () => {
		const axis = { min: 100, max: 200 };

		// translate 50, scale 2, origin 100
		applyAxisDelta(axis, 50, 2, 100);

		// min: scalePoint(100, 2, 100) + 50 = 100 + 50 = 150
		// max: scalePoint(200, 2, 100) + 50 = 300 + 50 = 350
		expect(axis).toEqual({ min: 150, max: 350 });
	});

	test('handles default values', () => {
		const axis = { min: 100, max: 200 };

		// translate 0, scale 1 (defaults), origin 150
		applyAxisDelta(axis, 0, 1, 150);

		// No change expected
		expect(axis).toEqual({ min: 100, max: 200 });
	});
});
