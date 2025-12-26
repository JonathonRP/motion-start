/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { VisualElement } from '../types';
export interface WithDepth {
	depth: number;
}

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
var compareByDepth = (a: VisualElement, b: VisualElement) => a.depth - b.depth;

export { compareByDepth };
