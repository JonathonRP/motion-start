/** Ported from framer-motion/packages/framer-motion/src/easing/utils/__tests__/map.test.ts */
import { describe, test, expect } from 'vitest';
import { backIn } from '../../back.js';
import { cubicBezier } from '../../cubic-bezier.js';
import { easeInOut } from '../../ease.js';
import { noop } from '../../../utils/noop.js';
import { easingDefinitionToFunction } from '../map.js';

describe('easingDefinitionToFunction', () => {
	test('Maps easing to lookup', () => {
		expect(easingDefinitionToFunction('linear')).toBe(noop);
		expect(easingDefinitionToFunction('easeInOut')).toBe(easeInOut);
		expect(easingDefinitionToFunction('backIn')).toBe(backIn);
		expect(easingDefinitionToFunction(backIn)).toBe(backIn);

		const bezier = easingDefinitionToFunction([0.2, 0.2, 0.8, 1]);
		expect(bezier(0.45)).toEqual(cubicBezier(0.2, 0.2, 0.8, 1)(0.45));
	});
});
