/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Axis } from '../../../types/geometry';
import type { LayoutState, TargetProjection } from '../../utils/state';

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { fixed } from '../../../utils/fix-process-env.js';
import { complex, px } from 'style-value-types';
import { mix } from 'popmotion';
import { cssVariableRegex } from '../utils/css-variables-conversion.js';

function pixelsToPercent(pixels: number, axis: Axis) {
	return (pixels / (axis.max - axis.min)) * 100;
}
/**
 * We always correct borderRadius as a percentage rather than pixels to reduce paints.
 * For example, if you are projecting a box that is 100px wide with a 10px borderRadius
 * into a box that is 200px wide with a 20px borderRadius, that is actually a 10%
 * borderRadius in both states. If we animate between the two in pixels that will trigger
 * a paint each time. If we animate between the two in percentage we'll avoid a paint.
 */
function correctBorderRadius(latest: string | number, _layoutState: LayoutState, { target }: TargetProjection) {
	/**
	 * If latest is a string, if it's a percentage we can return immediately as it's
	 * going to be stretched appropriately. Otherwise, if it's a pixel, convert it to a number.
	 */
	if (typeof latest === 'string') {
		if (px.test(latest)) {
			latest = Number.parseFloat(latest);
		} else {
			return latest;
		}
	}
	/**
	 * If latest is a number, it's a pixel value. We use the current viewportBox to calculate that
	 * pixel value as a percentage of each axis
	 */
	var x = pixelsToPercent(latest, target.x);
	var y = pixelsToPercent(latest, target.y);
	return x + '% ' + y + '%';
}
var varToken = '_$css';
function correctBoxShadow(latest: string | number, { delta, treeScale }: LayoutState) {
	var original = latest;
	/**
	 * We need to first strip and store CSS variables from the string.
	 */
	// @ts-expect-error
	var containsCSSVariables = latest.includes('var(');
	var cssVariables: any[] = [];
	if (containsCSSVariables) {// @ts-expect-error
		latest = latest.replace(cssVariableRegex, (match) => {
			cssVariables.push(match);
			return varToken;
		});
	}
	var shadow = complex.parse(latest);
	// TODO: Doesn't support multiple shadows
	if (shadow.length > 5) return original;
	var template = complex.createTransformer(latest);
	var offset = typeof shadow[0] !== 'number' ? 1 : 0;
	// Calculate the overall context scale
	var xScale = delta.x.scale * treeScale.x;
	var yScale = delta.y.scale * treeScale.y;
	//@ts-ignore
	shadow[0 + offset] /= xScale; //@ts-ignore
	shadow[1 + offset] /= yScale;
	/**
	 * Ideally we'd correct x and y scales individually, but because blur and
	 * spread apply to both we have to take a scale average and apply that instead.
	 * We could potentially improve the outcome of this by incorporating the ratio between
	 * the two scales.
	 */
	var averageScale = mix(xScale, yScale, 0.5);
	// Blur
	if (typeof shadow[2 + offset] === 'number')
		//@ts-ignore
		shadow[2 + offset] /= averageScale;
	// Spread
	if (typeof shadow[3 + offset] === 'number')
		//@ts-ignore
		shadow[3 + offset] /= averageScale;
	var output = template(shadow);
	if (containsCSSVariables) {
		var i_1 = 0;
		output = output.replace(varToken, () => {
			var cssVariable = cssVariables[i_1];
			i_1++;
			return cssVariable;
		});
	}
	return output;
}
var borderCorrectionDefinition = {
	process: correctBorderRadius,
};
var defaultScaleCorrectors = {
	borderRadius: Object.assign(Object.assign({}, borderCorrectionDefinition), {
		applyTo: ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'],
	}),
	borderTopLeftRadius: borderCorrectionDefinition,
	borderTopRightRadius: borderCorrectionDefinition,
	borderBottomLeftRadius: borderCorrectionDefinition,
	borderBottomRightRadius: borderCorrectionDefinition,
	boxShadow: {
		process: correctBoxShadow,
	},
} satisfies {
	borderRadius: {
		applyTo: string[];
		process: typeof correctBorderRadius;
	};
	borderTopLeftRadius: {
		process: typeof correctBorderRadius;
	};
	borderTopRightRadius: {
		process: typeof correctBorderRadius;
	};
	borderBottomLeftRadius: {
		process: typeof correctBorderRadius;
	};
	borderBottomRightRadius: {
		process: typeof correctBorderRadius;
	};
	boxShadow: {
		process: typeof correctBoxShadow;
	};
};

export { correctBorderRadius, correctBoxShadow, defaultScaleCorrectors, pixelsToPercent };
