/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export function isSVGElement(element: unknown): element is SVGElement {
	return element instanceof SVGElement && element.tagName !== 'svg';
}
