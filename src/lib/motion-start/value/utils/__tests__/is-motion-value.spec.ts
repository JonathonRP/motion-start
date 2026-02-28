/** Ported from framer-motion/packages/framer-motion/src/value/utils/__tests__/is-motion-value.test.ts */
import { describe, test, expect } from 'vitest';
import { motionValue } from '../..';
import { isMotionValue } from '../is-motion-value';

describe('isMotionValue', () => {
	test('correctly detects motion values', () => {
		expect(isMotionValue(motionValue(0))).toBe(true);
		expect(isMotionValue(undefined)).toBe(false);
		expect(isMotionValue('a')).toBe(false);
		expect(isMotionValue(null)).toBe(false);
		expect(isMotionValue(0)).toBe(false);
	});
});
