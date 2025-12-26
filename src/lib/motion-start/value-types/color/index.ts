/**
 * Color Value Types
 * Based on framer-motion@11.11.11 (internalized from style-value-types)
 * Copyright (c) 2018 Framer B.V.
 */

import type { ValueType, RGBA, HSLA } from '../types.js';
import { sanitize, singleColorRegex } from '../numbers/index.js';

const clamp = (min: number, max: number, v: number) => Math.min(Math.max(v, min), max);

/**
 * Parse a hex color to RGBA
 */
function parseHex(v: string): RGBA {
	let r = '';
	let g = '';
	let b = '';
	let a = '';

	// #RGB or #RGBA
	if (v.length === 4 || v.length === 5) {
		r = v[1];
		r += r;
		g = v[2];
		g += g;
		b = v[3];
		b += b;
		if (v.length === 5) {
			a = v[4];
			a += a;
		}
	}
	// #RRGGBB or #RRGGBBAA
	else if (v.length === 7 || v.length === 9) {
		r = v.slice(1, 3);
		g = v.slice(3, 5);
		b = v.slice(5, 7);
		if (v.length === 9) {
			a = v.slice(7, 9);
		}
	}

	return {
		red: parseInt(r, 16),
		green: parseInt(g, 16),
		blue: parseInt(b, 16),
		alpha: a ? parseInt(a, 16) / 255 : 1,
	};
}

/**
 * Hex color value type
 */
export const hex: ValueType = {
	test: (v) => typeof v === 'string' && v[0] === '#',
	parse: parseHex,
};

/**
 * RGBA to string
 */
function rgbaToString({ red, green, blue, alpha = 1 }: RGBA): string {
	return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

/**
 * Parse rgba() string
 */
function parseRgba(v: string): RGBA {
	const match = v.match(/rgba?\(([^)]+)\)/);
	if (!match) return { red: 0, green: 0, blue: 0, alpha: 1 };

	const values = match[1].split(/[,\s/]+/).map(parseFloat);
	return {
		red: values[0],
		green: values[1],
		blue: values[2],
		alpha: values[3] !== undefined ? values[3] : 1,
	};
}

/**
 * RGBA color value type
 */
export const rgba: ValueType = {
	test: (v) => typeof v === 'string' && (v.startsWith('rgb(') || v.startsWith('rgba(')),
	parse: parseRgba,
	transform: rgbaToString,
};

/**
 * HSLA to string
 */
function hslaToString({ hue, saturation, lightness, alpha = 1 }: HSLA): string {
	return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}

/**
 * Parse hsla() string
 */
function parseHsla(v: string): HSLA {
	const match = v.match(/hsla?\(([^)]+)\)/);
	if (!match) return { hue: 0, saturation: 0, lightness: 0, alpha: 1 };

	const values = match[1].split(/[,\s/]+/);
	return {
		hue: parseFloat(values[0]),
		saturation: parseFloat(values[1]),
		lightness: parseFloat(values[2]),
		alpha: values[3] !== undefined ? parseFloat(values[3]) : 1,
	};
}

/**
 * HSLA color value type
 */
export const hsla: ValueType = {
	test: (v) => typeof v === 'string' && (v.startsWith('hsl(') || v.startsWith('hsla(')),
	parse: parseHsla,
	transform: hslaToString,
};

/**
 * Generic color value type - tests for any color format
 */
export const color: ValueType = {
	test: (v) => {
		if (typeof v !== 'string') return false;
		return singleColorRegex.test(v);
	},
	parse: (v) => {
		if (hex.test(v)) {
			return hex.parse!(v);
		} else if (rgba.test(v)) {
			return rgba.parse!(v);
		} else if (hsla.test(v)) {
			return hsla.parse!(v);
		}
		return { red: 0, green: 0, blue: 0, alpha: 1 };
	},
	transform: (v) => {
		// If HSLA
		if ('hue' in v) {
			return hsla.transform!(v);
		}
		// Otherwise RGBA
		return rgba.transform!(v);
	},
};
