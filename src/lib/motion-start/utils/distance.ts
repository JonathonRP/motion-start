import type { Point2D } from '../types/geometry';

/**
 * Calculates the absolute distance between two numbers
 * @param a - First number
 * @param b - Second number
 * @returns Absolute difference between the numbers
 */
export const distance = (a: number, b: number) => Math.abs(a - b);

/**
 * Calculates the Euclidean distance between two 2D points
 * Uses the Pythagorean theorem
 * @param a - First point
 * @param b - Second point
 * @returns Euclidean distance between the points
 */
export function distance2D(a: Point2D, b: Point2D) {
	const xDelta = distance(a.x, b.x);
	const yDelta = distance(a.y, b.y);

	return Math.sqrt(xDelta ** 2 + yDelta ** 2);
}
