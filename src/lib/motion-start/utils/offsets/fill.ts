import { mixNumber } from '../mix/number.js';
import { progress } from '../progress.js';

/**
 * Fills an offset array with evenly distributed values
 * @param offset - Array to fill with offset values
 * @param remaining - Number of values to add
 */
export function fillOffset(offset: number[], remaining: number) {
	const min = offset[offset.length - 1];

	for (let i = 1; i <= remaining; i++) {
		const offsetProgress = progress(0, remaining, i);
		offset.push(mixNumber(min, 1, offsetProgress));
	}
}
