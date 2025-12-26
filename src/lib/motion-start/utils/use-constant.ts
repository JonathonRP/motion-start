/**
 * Creates a constant value over the lifecycle of a component
 *
 * This is a simple utility that ensures initialization functions don't execute
 * multiple times. In Svelte 5, you can use this pattern directly in your components.
 *
 * @param init - Initialization function
 * @returns The constant value
 */
export function useConstant<T>(init: () => T): T {
	let value: T | null = null;

	if (value === null) {
		value = init();
	}

	return value;
}
