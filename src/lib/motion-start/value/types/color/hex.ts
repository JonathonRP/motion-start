/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { RGBA } from '../types';
import { rgba } from './rgba';
import { isColorString } from './utils';

function parseHex(v: string): RGBA {
	let r = '';
	let g = '';
	let b = '';
	let a = '';

	// If we have 6 characters, ie #FF0000
	if (v.length > 5) {
		r = v.substring(1, 3);
		g = v.substring(3, 5);
		b = v.substring(5, 7);
		a = v.substring(7, 9);

		// Or we have 3 characters, ie #F00
	} else {
		r = v.substring(1, 2);
		g = v.substring(2, 3);
		b = v.substring(3, 4);
		a = v.substring(4, 5);
		r += r;
		g += g;
		b += b;
		a += a;
	}

	return {
		red: Number.parseInt(r, 16),
		green: Number.parseInt(g, 16),
		blue: Number.parseInt(b, 16),
		alpha: a ? Number.parseInt(a, 16) / 255 : 1,
	};
}

export const hex = {
	test: /*@__PURE__*/ isColorString('#'),
	parse: parseHex,
	transform: rgba.transform,
};
