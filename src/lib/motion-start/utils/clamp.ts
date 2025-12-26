/**
 * Clamps a value between a minimum and maximum bound
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @param v - Value to clamp
 * @returns The clamped value
 */
export const clamp = (min: number, max: number, v: number) => {
	if (v > max) return max;
	if (v < min) return min;
	return v;
};
