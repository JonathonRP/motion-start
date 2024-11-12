/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../VisualElement';

export interface WithDepth {
	depth: number;
}

export const compareByDepth = (a: VisualElement, b: VisualElement) => a.depth - b.depth;
