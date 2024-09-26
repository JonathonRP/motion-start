/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { HTMLRenderState } from "../types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
function renderHTML (element: HTMLElement, { style, vars }: HTMLRenderState) {
    // Directly assign style into the Element's style prop. In tests Object.assign is the
    // fastest way to assign styles.
    Object.assign(element.style, style);
    // Loop over any CSS variables and assign those.
    for (var key in vars) {
        element.style.setProperty(key, vars[key]);
    }
}

export { renderHTML };
