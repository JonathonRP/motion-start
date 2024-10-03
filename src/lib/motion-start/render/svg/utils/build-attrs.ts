/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { DOMVisualElementOptions } from '../../dom/types';
import type { ResolvedValues } from '../../types';
import type { MotionProps } from '../../../motion/types';
import type { LayoutState, TargetProjection } from '../../utils/state';
import type { SVGRenderState } from '../types';
import type {
	BuildProjectionTransform,
	BuildProjectionTransformOrigin,
} from '../../html/utils/build-projection-transform';

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { buildHTMLStyles } from '../../html/utils/build-styles.js';
import { calcSVGTransformOrigin } from './transform-origin.js';
import { buildSVGPath } from './path.js';

/**
 * Build SVG visual attrbutes, like cx and style.transform
 */
function buildSVGAttrs(
	state: SVGRenderState,
	{ attrX, attrY, originX, originY, pathLength, pathSpacing, pathOffset, ...latest }: ResolvedValues,
	projection: TargetProjection | undefined,
	layoutState: LayoutState | undefined,
	options: DOMVisualElementOptions,
	transformTemplate?: MotionProps['transformTemplate'],
	buildProjectionTransform?: BuildProjectionTransform,
	buildProjectionTransformOrigin?: BuildProjectionTransformOrigin
) {
	buildHTMLStyles(
		state,
		latest,
		projection,
		layoutState,
		options,
		transformTemplate,
		buildProjectionTransform,
		buildProjectionTransformOrigin
	);
	state.attrs = state.style;
	state.style = {};
	var attrs = state.attrs,
		style = state.style,
		dimensions = state.dimensions,
		totalPathLength = state.totalPathLength;
	/**
	 * However, we apply transforms as CSS transforms. So if we detect a transform we take it from attrs
	 * and copy it into style.
	 */
	if (attrs.transform) {
		if (dimensions) style.transform = attrs.transform;
		delete attrs.transform;
	}
	// Parse transformOrigin
	if (dimensions && (originX !== undefined || originY !== undefined || style.transform)) {
		style.transformOrigin = calcSVGTransformOrigin(
			dimensions,// @ts-expect-error
			originX !== undefined ? originX : 0.5,
			originY !== undefined ? originY : 0.5
		);
	}
	// Treat x/y not as shortcuts but as actual attributes
	if (attrX !== undefined) attrs.x = attrX;
	if (attrY !== undefined) attrs.y = attrY;
	// Build SVG path if one has been measured
	if (totalPathLength !== undefined && pathLength !== undefined) {
		buildSVGPath(attrs, totalPathLength, pathLength as number, pathSpacing as number, pathOffset as number, false);
	}
}

export { buildSVGAttrs };
