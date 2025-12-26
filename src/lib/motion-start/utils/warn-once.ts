const warned = new Set<string>();

/**
 * Checks if a warning message has already been issued
 * @param message - Warning message to check
 * @returns True if the warning has been issued before
 */
export function hasWarned(message: string) {
	return warned.has(message);
}

/**
 * Issues a warning once per unique message
 * Prevents duplicate warnings in the console
 * @param condition - Condition to check
 * @param message - Warning message
 * @param element - Optional element to log
 */
export function warnOnce(condition: boolean, message: string, element?: any) {
	if (condition || hasWarned(message)) return;

	console.warn(message);

	if (element) console.warn(element);

	warned.add(message);
}
