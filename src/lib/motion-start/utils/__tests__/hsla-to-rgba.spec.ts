/**
 * Based on framer-motion@11.11.11
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { hslaToRgba } from '../hsla-to-rgba';

describe('hslaToRgba', () => {
	test('Correctly converts hsla to rgba', () => {
		expect(
			hslaToRgba({
				hue: 190,
				saturation: 100,
				lightness: 80,
				alpha: 1,
			})
		).toEqual({ red: 153, green: 238, blue: 255, alpha: 1 });
	});
});
