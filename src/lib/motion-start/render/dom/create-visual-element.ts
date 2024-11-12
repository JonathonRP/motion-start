/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { HTMLVisualElement } from '../html/HTMLVisualElement';
import { SVGVisualElement } from '../svg/SVGVisualElement';
import type { CreateVisualElement, VisualElementOptions } from '../types';
import { isSVGComponent } from './utils/is-svg-component';

export const createDomVisualElement: CreateVisualElement<HTMLElement | SVGElement> = (
	Component: string,
	options: VisualElementOptions<HTMLElement | SVGElement>
) => {
	return isSVGComponent(Component)
		? new SVGVisualElement(options)
		: new HTMLVisualElement(options, {
				allowProjection: Component,
			});
};
