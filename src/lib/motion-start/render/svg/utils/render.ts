/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { SVGRenderState } from "../types";

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { camelToDash } from '../../dom/utils/camel-to-dash.js';
import { renderHTML } from '../../html/utils/render.js';
import { camelCaseAttributes } from './camel-case-attrs.js';

function renderSVG(element: HTMLElement, renderState: SVGRenderState) {
    renderHTML(element, renderState);
    for (var key in renderState.attrs) {
        element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key] as string);
    }
}

export { renderSVG };
