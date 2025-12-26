/**
 * Values that are considered invisible
 */
const invisibleValues = new Set(['none', 'hidden']);

/**
 * Mixes between visibility values
 * Handles special logic for transitioning between visible and invisible states
 * @param origin - Starting visibility value
 * @param target - Ending visibility value
 * @returns Function that returns the appropriate visibility value based on progress
 */
export function mixVisibility(origin: string, target: string) {
	if (invisibleValues.has(origin)) {
		return (p: number) => (p <= 0 ? origin : target);
	} else {
		return (p: number) => (p >= 1 ? target : origin);
	}
}

export { invisibleValues };
