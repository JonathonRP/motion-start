/** Ported from framer-motion/packages/framer-motion/src/render/svg/utils/__tests__/scrape-motion-values.test.ts */
import { describe, test, expect } from 'vitest';
import { motionValue } from '../../../../value';
import { scrapeMotionValuesFromProps } from '../scrape-motion-values.svelte';

describe('SVG scrapeMotionValuesFromProps', () => {
	test('correctly scrapes motion values from props', () => {
		const x = motionValue(0);
		const attrX = motionValue(0);
		const attrY = motionValue(0);
		const scale = motionValue(0);
		const attrScale = motionValue(0);

		expect(
			scrapeMotionValuesFromProps(
				{
					x: attrX,
					attrY,
					scale: attrScale,
					prev: 0,
					style: { x, scale },
				} as any,
				{
					prev: motionValue(1),
				} as any
			)
		).toEqual({
			attrX,
			attrY,
			attrScale,
			x,
			scale,
			prev: 0,
		});
	});
});
