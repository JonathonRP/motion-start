/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { isSVGElement } from '../../render/dom/utils/is-svg-element.js';
import { SVGVisualElement } from '../../render/svg/SVGVisualElement.js';
import { HTMLVisualElement } from '../../render/html/HTMLVisualElement.js';
import { visualElementStore } from '../../render/store.js';
import { ObjectVisualElement } from '../../render/object/ObjectVisualElement.js';
import type { VisualElementOptions } from '../../render/types.js';
import type { SVGRenderState } from '../../render/svg/types.js';
import type { HTMLRenderState } from '../../render/html/types.js';

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
