/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Component } from 'svelte';
import { HTMLVisualElement } from '../html/HTMLVisualElement';
import { SVGVisualElement } from '../svg/SVGVisualElement';
import type { CreateVisualElement, VisualElementOptions } from '../types';
import { isSVGComponent } from './utils/is-svg-component';

export const createDomVisualElement: CreateVisualElement<HTMLElement | SVGElement> = (
	Component: string | Component<Record<string, unknown>>,
	options: VisualElementOptions<HTMLElement | SVGElement>
) => {
	return isSVGComponent(Component as string | Component)
		? new SVGVisualElement(options)
		: new HTMLVisualElement(options, {
				allowProjection: Component !== null,
			});
};
