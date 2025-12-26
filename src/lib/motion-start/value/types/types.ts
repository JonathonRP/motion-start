/**
 * Color type definitions for motion-start
 */

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
 * Color type - can be RGBA, HSLA, hex string, etc.
 */
export type Color = RGBA | HSLA | string;
