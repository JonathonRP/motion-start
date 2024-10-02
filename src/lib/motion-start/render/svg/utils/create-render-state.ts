/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { SVGRenderState } from '../types';

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { createHtmlRenderState } from '../../html/utils/create-render-state.js';

var createSvgRenderState = () =>
	Object.assign(Object.assign({}, createHtmlRenderState()), { attrs: {} }) satisfies SVGRenderState;

export { createSvgRenderState };
