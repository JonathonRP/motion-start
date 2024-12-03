/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionStyle } from '../../../motion/types';
import type { IProjectionNode } from '../../../projection/node/types';
import { camelToDash } from '../../dom/utils/camel-to-dash';
import { renderHTML } from '../../html/utils/render';
import type { SVGRenderState } from '../types';
import { camelCaseAttributes } from './camel-case-attrs';

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
