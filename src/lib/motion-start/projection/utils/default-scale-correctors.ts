/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { mix } from 'popmotion';
import { complex, px } from 'style-value-types';
import type { Axis } from '../geometry/types.js';
import type { LayoutState, TargetProjection } from '../../render/utils/state.js';
import { cssVariableRegex } from '../../render/dom/utils/css-variables-conversion.js';

function pixelsToPercent(pixels: number, axis: Axis): number {
	return (pixels / (axis.max - axis.min)) * 100;
}

/**
 * We always correct borderRadius as a percentage rather than pixels to reduce paints.
 * For example, if you are projecting a box that is 100px wide with a 10px borderRadius
 * into a box that is 200px wide with a 20px borderRadius, that is actually a 10%
 * borderRadius in both states. If we animate between the two in pixels that will trigger
 * a paint each time. If we animate between the two in percentage we'll avoid a paint.
 */
function correctBorderRadius(latest: string | number, _layoutState: LayoutState, { target }: TargetProjection): string | number {
	/**
	 * If latest is a string, if it's a percentage we can return immediately as it's
	 * going to be stretched appropriately. Otherwise, if it's a pixel, convert it to a number.
	 */
	if (typeof latest === 'string') {
		if (px.test(latest)) {
			latest = parseFloat(latest);
		} else {
			return latest;
		}
	}

	/**
	 * If latest is a number, it's a pixel value. We use the current viewportBox to calculate that
	 * pixel value as a percentage of each axis
	 */
	const x = pixelsToPercent(latest, target.x);
	const y = pixelsToPercent(latest, target.y);

	return `${x}% ${y}%`;
}

const varToken = '_$css';

function correctBoxShadow(latest: string | number, { delta, treeScale }: LayoutState): string | number {
	const original = latest;

	/**
	 * We need to first strip and store CSS variables from the string.
	 */
	const containsCSSVariables = (latest as string).includes('var(');
	const cssVariables: string[] = [];

	if (containsCSSVariables) {
		latest = (latest as string).replace(cssVariableRegex, (match) => {
			cssVariables.push(match);
			return varToken;
		});
	}

	const shadow = complex.parse(latest as string);

	// TODO: Doesn't support multiple shadows
	if (shadow.length > 5) return original;

	const template = complex.createTransformer(latest as string);
	const offset = typeof shadow[0] !== 'number' ? 1 : 0;

	// Calculate the overall context scale
	const xScale = delta.x.scale * treeScale.x;
	const yScale = delta.y.scale * treeScale.y;

	(shadow[0 + offset] as number) /= xScale;
	(shadow[1 + offset] as number) /= yScale;

	/**
	 * Ideally we'd correct x and y scales individually, but because blur and
	 * spread apply to both we have to take a scale average and apply that instead.
	 * We could potentially improve the outcome of this by incorporating the ratio between
	 * the two scales.
	 */
	const averageScale = mix(xScale, yScale, 0.5);

	// Blur
	if (typeof shadow[2 + offset] === 'number') {
		(shadow[2 + offset] as number) /= averageScale;
	}

	// Spread
	if (typeof shadow[3 + offset] === 'number') {
		(shadow[3 + offset] as number) /= averageScale;
	}

	let output = template(shadow);

	if (containsCSSVariables) {
		let i = 0;
		output = output.replace(varToken, () => {
			const cssVariable = cssVariables[i];
			i++;
			return cssVariable;
		});
	}

	return output;
}

const borderCorrectionDefinition = {
	process: correctBorderRadius,
};

export const defaultScaleCorrectors = {
	borderRadius: {
		...borderCorrectionDefinition,
		applyTo: ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'],
	},
	borderTopLeftRadius: borderCorrectionDefinition,
	borderTopRightRadius: borderCorrectionDefinition,
	borderBottomLeftRadius: borderCorrectionDefinition,
	borderBottomRightRadius: borderCorrectionDefinition,
	boxShadow: {
		process: correctBoxShadow,
	},
};

export { correctBorderRadius, correctBoxShadow, pixelsToPercent };
