/**
 * Immediate transition between two values
 * Returns the first value when progress is 0, otherwise returns the second value
 * @param a - First value
 * @param b - Second value
 * @returns Function that performs immediate transition
 */
export function mixImmediate<T>(a: T, b: T) {
	return (p: number) => (p > 0 ? b : a);
}
