/**
 * Numeric Value Types
 * Based on framer-motion@11.11.11 (internalized from style-value-types)
 * Copyright (c) 2018 Framer B.V.
 */

import type { ValueType } from '../types.js';

const clamp = (min: number, max: number, v: number) => Math.min(Math.max(v, min), max);

const sanitize = (v: number) => (v % 1 ? Number(v.toFixed(5)) : v);

const floatRegex = /(-)?([\d]*\.?[\d])+/g;
const colorRegex =
	/(#[0-9a-f]{3,8}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi;
const singleColorRegex =
	/^(#[0-9a-f]{3,8}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;

/**
 * Tests if a value is a number
 */
export function isNumber(v: any): v is number {
	return typeof v === 'number';
}

/**
 * Number value type - any numeric value
 */
export const number: ValueType = {
	test: (v) => typeof v === 'number',
	parse: parseFloat,
	transform: (v) => v,
};

/**
 * Alpha/opacity value type - clamped between 0 and 1
 */
export const alpha: ValueType = {
	...number,
	transform: (v) => clamp(0, 1, v),
};

/**
 * Scale value type - for transform scale
 */
export const scale: ValueType = {
	...number,
	default: 1,
};

/**
 * Progress percentage - 0 to 100
 */
export const progressPercentage: ValueType = {
	...number,
	transform: (v) => clamp(0, 100, v),
};

/**
 * Creates a unit-based value type (px, %, deg, etc.)
 */
const createUnitType = (unit: string): ValueType => ({
	test: (v) => typeof v === 'string' && v.endsWith(unit),
	parse: parseFloat,
	transform: (v) => `${v}${unit}`,
});

/**
 * Pixel value type
 */
export const px: ValueType = createUnitType('px');

/**
 * Percentage value type
 */
export const percent: ValueType = createUnitType('%');

/**
 * Degree value type
 */
export const degrees: ValueType = createUnitType('deg');

/**
 * Viewport width value type
 */
export const vw: ValueType = createUnitType('vw');

/**
 * Viewport height value type
 */
export const vh: ValueType = createUnitType('vh');

export { sanitize, floatRegex, colorRegex, singleColorRegex };
