import { hex, hsla, rgba } from '../../value-types/index.js';
import type { HSLA, RGBA } from '../../value/types/types.js';
import { hslaToRgba } from '../hsla-to-rgba.js';
import { mixNumber } from './number.js';
import { mixImmediate } from './immediate.js';
import { warnOnce } from '../warn-once.js';

/**
 * Converts a color to RGBA format
 * @param color - Color in any supported format (hex, rgba, hsla)
 * @returns RGBA color object or undefined
 */
function asRGBA(color: string | HSLA | RGBA): RGBA | undefined {
	if (typeof color !== 'string') {
		return color as RGBA;
	}

	if (hex.test(color)) {
		return hex.parse(color) as RGBA;
	} else if (rgba.test(color)) {
		return rgba.parse(color) as RGBA;
	} else if (hsla.test(color)) {
		return hslaToRgba(hsla.parse(color) as HSLA);
	}

	if (process.env?.NODE_ENV !== 'production') {
		warnOnce(false, `'${color}' is not an animatable color. Use the equivalent color code instead.`);
	}

	return undefined;
}

/**
 * Linear color space mixing
 * Adapted from:
 * - https://www.youtube.com/watch?v=LKnqECcg6Gw
 * - https://youtube.com/watch?v=LKnqECcg6Gw
 * - https://www.youtube.com/watch?v=1aW7neUQBas
 */
const mixLinearColor = (from: number, to: number, v: number) => {
	const fromExpo = from * from;
	const expo = v * (to * to - fromExpo) + fromExpo;
	return expo < 0 ? 0 : Math.sqrt(expo);
};

/**
 * Mixes between two colors
 * @param from - Starting color
 * @param to - Ending color
 * @returns Function that interpolates between the colors
 */
export function mixColor(from: RGBA | HSLA | string, to: RGBA | HSLA | string) {
	const fromRGBA = asRGBA(from);
	const toRGBA = asRGBA(to);

	if (!fromRGBA || !toRGBA) {
		return mixImmediate(from, to);
	}

	const blended = { ...fromRGBA };

	return (v: number) => {
		blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
		blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
		blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
		blended.alpha = mixNumber(fromRGBA.alpha, toRGBA.alpha, v);

		return rgba.transform!(blended);
	};
}
