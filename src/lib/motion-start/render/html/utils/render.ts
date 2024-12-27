/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionStyle } from '../../..';
import type { IProjectionNode } from '../../../projection/node/types';
import type { HTMLRenderState } from '../types';

export function renderHTML(
	element: HTMLElement,
	{ style, vars }: HTMLRenderState,
	styleProp?: MotionStyle,
	projection?: IProjectionNode<unknown>
) {
	Object.assign(element.style, style, projection && projection.getProjectionStyles(styleProp));

	// Loop over any CSS variables and assign those.
	for (const key in vars) {
		element.style.setProperty(key, vars[key] as string);
	}
}
