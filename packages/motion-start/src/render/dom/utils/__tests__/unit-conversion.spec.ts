/** Ported from framer-motion/packages/framer-motion/src/render/dom/utils/__tests__/unit-conversion.test.ts */
import { describe, test, expect } from 'vitest';
import { positionalValues } from '../unit-conversion.js';

describe('positionalValues', () => {
	test('Correctly factors in padding when measuring width/height', () => {
		const bbox = { x: { min: 0, max: 100 }, y: { min: 0, max: 300 } };

		expect(positionalValues.width(bbox, { paddingLeft: '50px' })).toBe(50);
		expect(positionalValues.width(bbox, { paddingRight: '25px' })).toBe(75);
		expect(positionalValues.height(bbox, { paddingTop: '50px' })).toBe(250);
		expect(positionalValues.height(bbox, { paddingBottom: '25px' })).toBe(275);
	});

	test('Ignores padding when box-sizing is border-box', () => {
		const bbox = { x: { min: 0, max: 100 }, y: { min: 0, max: 300 } };

		expect(positionalValues.width(bbox, { paddingLeft: '50px', boxSizing: 'border-box' })).toBe(100);
		expect(
			positionalValues.width(bbox, {
				paddingLeft: '50px',
				paddingRight: '25px',
				boxSizing: 'border-box',
			})
		).toBe(100);
		expect(positionalValues.height(bbox, { paddingTop: '50px', boxSizing: 'border-box' })).toBe(300);
		expect(
			positionalValues.height(bbox, {
				paddingTop: '50px',
				paddingBottom: '25px',
				boxSizing: 'border-box',
			})
		).toBe(300);
	});

	test('Still subtracts padding when box-sizing is content-box', () => {
		const bbox = { x: { min: 0, max: 100 }, y: { min: 0, max: 300 } };

		expect(positionalValues.width(bbox, { paddingLeft: '50px', boxSizing: 'content-box' })).toBe(50);
		expect(positionalValues.height(bbox, { paddingTop: '50px', boxSizing: 'content-box' })).toBe(250);
	});
});
