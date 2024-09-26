/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VisualElement } from "../types";
export interface WithDepth {
    depth: number;
}

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
var compareByDepth = function (a: VisualElement, b: VisualElement) {
    return a.depth - b.depth;
};

export { compareByDepth };
