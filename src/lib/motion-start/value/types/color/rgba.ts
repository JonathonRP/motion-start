/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { clamp } from '../../../utils/clamp';
import { alpha as alphaType, number } from '../numbers';
import type { RGBA } from '../types';
import { sanitize } from '../utils/sanitize';
import { isColorString, splitColor } from './utils';

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
