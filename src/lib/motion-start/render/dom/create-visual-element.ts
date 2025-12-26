/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import { htmlVisualElement } from '../html/visual-element.js';
import { svgVisualElement } from '../svg/visual-element.js';
import type { CreateVisualElement } from '../types';

var createDomVisualElement: CreateVisualElement<HTMLElement | SVGElement> = (Component, options) =>
	Component === 'SVG'
		? svgVisualElement(options!, { enableHardwareAcceleration: false })
		: htmlVisualElement(options!, { enableHardwareAcceleration: true });

export { createDomVisualElement };
