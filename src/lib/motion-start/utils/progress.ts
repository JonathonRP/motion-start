/**
 * Progress
 * Calculates the progress (expressed as a number 0-1) represented by the given value
 * @param from - Lower bound
 * @param to - Upper bound
 * @param value - Current value
 * @returns Progress as a value between 0 and 1
 */
export const progress = (from: number, to: number, value: number) => {
	const toFromDifference = to - from;

	return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};
