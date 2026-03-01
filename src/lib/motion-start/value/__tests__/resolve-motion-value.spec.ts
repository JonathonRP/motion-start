/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { motionValue } from '../index';
import { resolveMotionValue } from '../utils/resolve-motion-value';

describe('resolveMotionValue', () => {
	test('should leave non-motion values alone', () => {
		const value: any = { test: 'foo' };
		expect(resolveMotionValue(value)).toBe(value);
		expect(resolveMotionValue(4)).toBe(4);
	});

	test('should unwrap a motion value', () => {
		const mv = motionValue(3);
		expect(resolveMotionValue(mv)).toBe(3);

		const value = { test: 'bar' };
		const mv2 = motionValue(value);
		expect(resolveMotionValue(mv2)).toBe(value);
	});

	test('should handle string motion values', () => {
		const mv = motionValue('100px');
		expect(resolveMotionValue(mv)).toBe('100px');
	});
});
