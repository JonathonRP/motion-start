/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import { createHtmlRenderState } from '../../html/utils/create-render-state.js';
import type { SVGRenderState } from '../types';

var createSvgRenderState = () =>
	Object.assign(Object.assign({}, createHtmlRenderState()), { attrs: {} }) satisfies SVGRenderState;

export { createSvgRenderState };
