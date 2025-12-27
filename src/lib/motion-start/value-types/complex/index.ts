/**
 * Complex Value Type
 * Based on framer-motion@11.11.11 (internalized from style-value-types)
 * Copyright (c) 2018 Framer B.V.
 *
 * Handles complex values like "10px 20px rgba(0,0,0,0.5)"
 */

import type { ValueType } from '../types.js';
import { color } from '../color/index.js';
import { floatRegex, colorRegex, sanitize } from '../numbers/index.js';

/**
 * Complex value - combination of numbers, units, and colors
 */
export const complex: ValueType = {
	test: (v) => {
		if (typeof v !== 'string' || !isNaN(Number(v))) return false;

		// Must contain at least one number or color
		return floatRegex.test(v) || colorRegex.test(v);
	},

	parse: (v: string) => {
		const values: any[] = [];
		const indexes: number[] = [];

		// Extract colors first
		const input = v.replace(colorRegex, (match) => {
			values.push(color.parse!(match));
			indexes.push(values.length - 1);
			return '${c}';
		});

		// Then extract numbers
		const parts = input.match(floatRegex);
		if (parts) {
			parts.forEach((num) => {
				values.push(parseFloat(num));
			});
		}

		return { values, template: input, indexes };
	},

	createTransformer: (template: string) => {
		return (v: any) => {
			let output = template;
			const { values } = v;

			// Replace color placeholders
			v.indexes?.forEach((index: number) => {
				const value = values[index];
				const colorString = String(color.transform!(value));
				output = output.replace('${c}', colorString);
			});

			// Replace number placeholders
			values.forEach((value: number) => {
				if (typeof value === 'number') {
					output = output.replace(floatRegex, sanitize(value).toString());
				}
			});

			return output;
		};
	},
};

/**
 * Filter value type - for CSS filter functions
 */
export const filter: ValueType = {
	...complex,
	test: (v) => typeof v === 'string' && v.includes('(') && v.includes(')'),
	default: 'none',
};
