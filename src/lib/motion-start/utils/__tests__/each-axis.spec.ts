/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { eachAxis } from '../each-axis';

describe('eachAxis', () => {
	test('fires the callback once for each axis and returns an array with the results', () => {
		expect(eachAxis((axis) => axis)).toEqual(['x', 'y']);
	});
});
