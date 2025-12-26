/**
 * Converts offset values to time values
 * @param offset - Array of offset values (0-1)
 * @param duration - Total duration
 * @returns Array of time values
 */
export function convertOffsetToTimes(offset: number[], duration: number) {
	return offset.map((o) => o * duration);
}
