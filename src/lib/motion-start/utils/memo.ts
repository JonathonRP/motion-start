/**
 * Memoization utility
 * Caches the result of a callback function and returns the cached value on subsequent calls
 * @param callback - Function to memoize
 * @returns Memoized function
 */
export function memo<T extends any>(callback: () => T) {
	let result: T | undefined;

	return () => {
		if (result === undefined) result = callback();
		return result;
	};
}
