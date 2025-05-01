/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { isSVGElement } from '../../render/dom/utils/is-svg-element';
import { SVGVisualElement } from '../../render/svg/SVGVisualElement';
import { HTMLVisualElement } from '../../render/html/HTMLVisualElement';
import { visualElementStore } from '../../render/store';
import { ObjectVisualElement } from '../../render/object/ObjectVisualElement';
import type { VisualElementOptions } from '../../render/types';
import type { SVGRenderState } from '../../render/svg/types';
import type { HTMLRenderState } from '../../render/html/types';

export function createDOMVisualElement(element: HTMLElement | SVGElement) {
	const options = {
		presenceContext: null,
		props: {},
		visualState: {
			renderState: {
				transform: {},
				transformOrigin: {},
				transformKeys: [],
				style: {},
				vars: {},
				attrs: {},
			},
			latestValues: {},
		},
	} satisfies VisualElementOptions<SVGElement | HTMLElement, SVGRenderState | HTMLRenderState>;
	const node = isSVGElement(element) ? new SVGVisualElement(options) : new HTMLVisualElement(options);

	node.mount(element as any);

	visualElementStore.set(element, node);
}

export function createObjectVisualElement(subject: Object) {
	const options = {
		presenceContext: null,
		props: {},
		visualState: {
			renderState: {
				output: {},
			},
			latestValues: {},
		},
	};
	const node = new ObjectVisualElement(options);

	node.mount(subject);

	visualElementStore.set(subject, node);
}
