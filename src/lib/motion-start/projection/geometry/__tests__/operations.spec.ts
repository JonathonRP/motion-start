/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, it, expect } from 'vitest';
import { createAxis } from '../models';
import { translateAxis } from '../delta-apply';

describe('translateAxis', () => {
	it('translates by the defined amount', () => {
		const axis = createAxis();
		axis.max = 100;
		translateAxis(axis, 100);
		expect(axis).toEqual({ min: 100, max: 200 });
		translateAxis(axis, -100);
		expect(axis).toEqual({ min: 0, max: 100 });
	});
});
