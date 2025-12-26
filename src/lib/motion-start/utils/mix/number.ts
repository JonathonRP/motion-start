/**
 * Linear interpolation between two numbers
 * @param from - Starting value
 * @param to - Ending value
 * @param progress - Progress value between 0 and 1
 * @returns Interpolated value
 */
export const mixNumber = (from: number, to: number, progress: number) => {
	return from + (to - from) * progress;
};
