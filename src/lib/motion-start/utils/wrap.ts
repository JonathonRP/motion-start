/**
 * Wraps a value within a specified range
 * Useful for circular animations and value wrapping
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @param v - Value to wrap
 * @returns Wrapped value within the range
 */
export const wrap = (min: number, max: number, v: number) => {
	const rangeSize = max - min;
	return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};
