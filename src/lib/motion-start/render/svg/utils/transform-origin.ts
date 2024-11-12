/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { fixed } from '../../../utils/fix-process-env';
import { px } from '../../../value/types/numbers/units';
import type { SVGDimensions } from '../types';

function calcOrigin(origin: number | string, offset: number, size: number) {
	return typeof origin === 'string' ? origin : px.transform(offset + size * origin);
}

/**
 * The SVG transform origin defaults are different to CSS and is less intuitive,
 * so we use the measured dimensions of the SVG to reconcile these.
 */
export function calcSVGTransformOrigin(dimensions: SVGDimensions, originX: number | string, originY: number | string) {
	const pxOriginX = calcOrigin(originX, dimensions.x, dimensions.width);
	const pxOriginY = calcOrigin(originY, dimensions.y, dimensions.height);
	return `${pxOriginX} ${pxOriginY}`;
}
