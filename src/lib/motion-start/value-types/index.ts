/**
 * Value Types Module
 * Based on framer-motion@11.11.11 (internalized from style-value-types)
 * Copyright (c) 2018 Framer B.V.
 *
 * This module provides value type definitions for parsing and transforming
 * CSS values including numbers, units, colors, and complex values.
 */

// Types
export type { ValueType, RGBA, HSLA, Color } from './types.js';

// Number value types
export {
	number,
	alpha,
	scale,
	progressPercentage,
	px,
	percent,
	degrees,
	vw,
	vh,
	isNumber,
	sanitize,
	floatRegex,
	colorRegex,
	singleColorRegex,
} from './numbers/index.js';

// Color value types
export { hex, rgba, hsla, color } from './color/index.js';

// Complex value types
export { complex, filter } from './complex/index.js';
