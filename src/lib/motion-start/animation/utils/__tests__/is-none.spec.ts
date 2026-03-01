/** Ported from framer-motion/packages/framer-motion/src/animation/utils/__tests__/is-none.test.ts */
import { describe, test, expect } from 'vitest';
import { isNone } from '../is-none';

describe('isNone', () => {
	test('Detects zero/none values', () => {
		expect(isNone(0)).toBe(true);
		expect(isNone(1)).toBe(false);
		expect(isNone('0')).toBe(true);
		expect(isNone('0px')).toBe(true);
		expect(isNone('0%')).toBe(true);
		expect(isNone('100')).toBe(false);
		expect(isNone('100px')).toBe(false);
		expect(isNone('100%')).toBe(false);
		expect(isNone('none')).toBe(true);
	});
});
