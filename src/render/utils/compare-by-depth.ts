/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { VisualElement } from "../types";
export interface WithDepth {
    depth: number;
}
export declare const compareByDepth: (a: VisualElement, b: VisualElement) => number;

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
var compareByDepth = function (a, b) {
    return a.depth - b.depth;
};

export { compareByDepth };
