/** Ported from framer-motion/packages/framer-motion/src/render/dom/utils/__tests__/unit-conversion.test.ts */
import { describe, test, expect } from 'vitest';
import { positionalValues } from '../unit-conversion';

describe('positionalValues', () => {
	test('Correctly factors in padding when measuring width/height', () => {
		const bbox = { x: { min: 0, max: 100 }, y: { min: 0, max: 300 } };

		expect(positionalValues.width(bbox, { paddingLeft: '50px' })).toBe(50);
		expect(positionalValues.width(bbox, { paddingRight: '25px' })).toBe(75);
		expect(positionalValues.height(bbox, { paddingTop: '50px' })).toBe(250);
		expect(positionalValues.height(bbox, { paddingBottom: '25px' })).toBe(275);
	});
});
