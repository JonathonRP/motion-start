/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { SVGRenderState } from "../types";

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { __assign } from 'tslib';
import { createHtmlRenderState } from '../../html/utils/create-render-state.js';

var createSvgRenderState = function () { return (__assign(__assign({}, createHtmlRenderState()), { attrs: {} })) satisfies SVGRenderState; };

export { createSvgRenderState };

