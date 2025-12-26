/**
 * Value Type System
 * Based on framer-motion@11.11.11 (internalized from style-value-types)
 * Copyright (c) 2018 Framer B.V.
 */

/**
 * ValueType interface for CSS value parsing and formatting
 */
export interface ValueType {
	test: (v: any) => boolean;
	parse: (v: any) => any;
	transform?: (v: any) => string | number;
	createTransformer?: (template: string) => (v: any) => string;
	default?: any;
	getAnimatableNone?: (v: any) => any;
}

/**
 * RGBA color representation
 */
export interface RGBA {
	red: number;
	green: number;
	blue: number;
	alpha: number;
}

/**
 * HSLA color representation
 */
export interface HSLA {
	hue: number;
	saturation: number;
	lightness: number;
	alpha: number;
}

/**
 * Color can be RGBA or HSLA
 */
export type Color = RGBA | HSLA;
