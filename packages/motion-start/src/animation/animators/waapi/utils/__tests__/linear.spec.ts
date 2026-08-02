/** Ported from framer-motion/packages/framer-motion/src/animation/animators/waapi/utils/__tests__/linear.test.ts */
import { describe, test, expect } from 'vitest';
import { noop } from '../../../../../utils/noop.js';
import { generateLinearEasing } from '../linear.svelte.js';

describe('generateLinearEasing', () => {
	test('Converts easing function into string of points', () => {
		expect(generateLinearEasing(noop, 110)).toEqual(
			'linear(0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1)'
		);
		expect(generateLinearEasing(() => 0.5, 200)).toEqual(
			'linear(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)'
		);
		expect(generateLinearEasing(() => 0.5, 0)).toEqual('linear(0.5, 0.5)');
	});

	/**
	 * Regression test for motion 12.17.0:
	 * "Improved rounding for `linear()` easing curves."
	 */
	test('Rounds generated points to 4 decimal places', () => {
		expect(generateLinearEasing((p) => p / 3, 30)).toEqual('linear(0, 0.1667, 0.3333)');
		expect(generateLinearEasing(() => 1 / 3, 20)).toEqual('linear(0.3333, 0.3333)');
		expect(generateLinearEasing(() => 0.000001, 20)).toEqual('linear(0, 0)');
	});
});
