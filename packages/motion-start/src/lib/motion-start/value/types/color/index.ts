/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { HSLA, RGBA } from '../types.js';
import { hex } from './hex.js';
import { hsla } from './hsla.js';
import { rgba } from './rgba.js';

export const color = {
	test: (v: any) => rgba.test(v) || hex.test(v) || hsla.test(v),
	parse: (v: any): RGBA | HSLA => {
		if (rgba.test(v)) {
			return rgba.parse(v);
		} else if (hsla.test(v)) {
			return hsla.parse(v);
		} else {
			return hex.parse(v);
		}
	},
	transform: (v: HSLA | RGBA | string) => {
		return typeof v === 'string' ? v : v.hasOwnProperty('red') ? rgba.transform(v as RGBA) : hsla.transform(v as HSLA);
	},
};
