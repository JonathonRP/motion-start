/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.svelte.js';
import type { SVGRenderState } from './types.js';
import { DOMVisualElement } from '../dom/DOMVisualElement.js';
import type { DOMVisualElementOptions } from '../dom/types.js';
import { buildSVGAttrs } from './utils/build-attrs.js';
import { camelToDash } from '../dom/utils/camel-to-dash.js';
import { camelCaseAttributes } from './utils/camel-case-attrs.js';
import { transformProps } from '../html/utils/transform.js';
import { renderSVG } from './utils/render.js';
import { getDefaultValueType } from '../dom/value-types/defaults.js';
import type { MotionProps, MotionStyle } from '../../motion/types.js';
import type { MotionValue } from '../../value/index.js';
import type { ResolvedValues } from '../types.js';
import { createBox } from '../../projection/geometry/models.js';
import type { IProjectionNode } from '../../projection/node/types.js';
import { isSVGTag } from './utils/is-svg-tag.js';
import type { VisualElement } from '../VisualElement.svelte.js';

export class SVGVisualElement extends DOMVisualElement<SVGElement, SVGRenderState, DOMVisualElementOptions> {
	type = 'svg';

	isSVGTag = false;

	getBaseTargetFromProps(props: MotionProps, key: string): string | number | MotionValue<any> | undefined {
		return props[key as keyof MotionProps];
	}

	readValueFromInstance(instance: SVGElement, key: string) {
		if (transformProps.has(key)) {
			const defaultType = getDefaultValueType(key);
			return defaultType ? defaultType.default || 0 : 0;
		}
		key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
		return instance.getAttribute(key);
	}

	measureInstanceViewportBox = createBox;

	scrapeMotionValuesFromProps(props: MotionProps, prevProps: MotionProps, visualElement: VisualElement<SVGElement>) {
		return scrapeMotionValuesFromProps(props, prevProps, visualElement);
	}

	build(renderState: SVGRenderState, latestValues: ResolvedValues, props: MotionProps) {
		buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate);
	}

	renderInstance(
		instance: SVGElement,
		renderState: SVGRenderState,
		styleProp?: MotionStyle | undefined,
		projection?: IProjectionNode<unknown> | undefined
	): void {
		renderSVG(instance, renderState, styleProp, projection);
	}

	mount(instance: SVGElement) {
		this.isSVGTag = isSVGTag(instance.tagName);
		super.mount(instance);
	}
}
