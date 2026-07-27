/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionStyle } from '../../../motion/types.js';
import type { IProjectionNode } from '../../../projection/node/types.js';
import { camelToDash } from '../../dom/utils/camel-to-dash.js';
import { renderHTML } from '../../html/utils/render.js';
import type { SVGRenderState } from '../types.js';
import { camelCaseAttributes } from './camel-case-attrs.js';

export function renderSVG(
	element: SVGElement,
	renderState: SVGRenderState,
	_styleProp?: MotionStyle,
	projection?: IProjectionNode<unknown>
) {
	renderHTML(element as any, renderState, undefined, projection);

	for (const key in renderState.attrs) {
		element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key] as string);
	}
}
