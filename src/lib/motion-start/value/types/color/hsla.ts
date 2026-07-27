/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { alpha as alphaType } from '../numbers/index.js';
import { percent } from '../numbers/units.js';
import type { HSLA } from '../types.js';
import { sanitize } from '../utils/sanitize.js';
import { isColorString, splitColor } from './utils.js';

export const hsla = {
	test: /*@__PURE__*/ isColorString('hsl', 'hue'),
	parse: /*@__PURE__*/ splitColor<HSLA>('hue', 'saturation', 'lightness'),
	transform: ({ hue, saturation, lightness, alpha = 1 }: HSLA) => {
		return (
			'hsla(' +
			Math.round(hue) +
			', ' +
			percent.transform(sanitize(saturation)) +
			', ' +
			percent.transform(sanitize(lightness)) +
			', ' +
			sanitize(alphaType.transform(alpha)) +
			')'
		);
	},
};
