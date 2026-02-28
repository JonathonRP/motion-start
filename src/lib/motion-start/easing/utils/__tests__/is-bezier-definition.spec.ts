/** Ported from framer-motion/packages/framer-motion/src/easing/utils/__tests__/is-bezier-definition.test.ts */
import { test, expect } from 'vitest';
import { isBezierDefinition } from '../is-bezier-definition';

test('isBezierDefinition', () => {
	expect(isBezierDefinition('linear')).toEqual(false);
	expect(isBezierDefinition((v: number) => v)).toEqual(false);
	expect(isBezierDefinition(['linear'])).toEqual(false);
	expect(isBezierDefinition([0, 1, 2, 3])).toEqual(true);
	expect(isBezierDefinition([0, 1, 2, 3] as const)).toEqual(true);
});
