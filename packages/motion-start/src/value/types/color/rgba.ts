/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { clamp } from '../../../utils/clamp.js';
import { alpha as alphaType, number } from '../numbers/index.js';
import type { RGBA } from '../types.js';
import { sanitize } from '../utils/sanitize.js';
import { isColorString, splitColor } from './utils.js';

const clampRgbUnit = (v: number) => clamp(0, 255, v);
export const rgbUnit = {
	...number,
	transform: (v: number) => Math.round(clampRgbUnit(v)),
};

export const rgba = {
	test: /*@__PURE__*/ isColorString('rgb', 'red'),
	parse: /*@__PURE__*/ splitColor<RGBA>('red', 'green', 'blue'),
	transform: ({ red, green, blue, alpha = 1 }: RGBA) =>
		'rgba(' +
		rgbUnit.transform(red) +
		', ' +
		rgbUnit.transform(green) +
		', ' +
		rgbUnit.transform(blue) +
		', ' +
		sanitize(alphaType.transform(alpha)) +
		')',
};
