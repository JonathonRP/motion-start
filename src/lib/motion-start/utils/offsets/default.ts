import { fillOffset } from './fill.js';

/**
 * Creates a default offset array for an array of values
 * @param arr - Array to create offsets for
 * @returns Array of offset values from 0 to 1
 */
export function defaultOffset(arr: any[]): number[] {
	const offset = [0];
	fillOffset(offset, arr.length - 1);
	return offset;
}
