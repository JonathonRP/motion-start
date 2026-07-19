/** Ported from framer-motion/packages/framer-motion/src/value/use-will-change/__tests__/is.test.ts */
import { describe, test, expect } from 'vitest';
import { isWillChangeMotionValue } from '../is.js';
import { WillChangeMotionValue } from '../WillChangeMotionValue.js';
import { MotionValue } from '../../index.js';

describe('isWillChangeMotionValue', () => {
	test('Correctly detects WillChangeMotionValue', () => {
		expect(isWillChangeMotionValue(new WillChangeMotionValue('auto'))).toBe(true);
		expect(isWillChangeMotionValue(1)).toBe(false);
		expect(isWillChangeMotionValue(undefined)).toBe(false);
		expect(isWillChangeMotionValue(new MotionValue(0))).toBe(false);
	});
});
