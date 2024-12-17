/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.svelte';
import type { SVGRenderState } from './types';
import { DOMVisualElement } from '../dom/DOMVisualElement.svelte';
import type { DOMVisualElementOptions } from '../dom/types';
import { buildSVGAttrs } from './utils/build-attrs.svelte';
import { camelToDash } from '../dom/utils/camel-to-dash';
import { camelCaseAttributes } from './utils/camel-case-attrs';
import { transformProps } from '../html/utils/transform.svelte';
import { renderSVG } from './utils/render.svelte';
import { getDefaultValueType } from '../dom/value-types/defaults';
import type { MotionProps, MotionStyle } from '../../motion/types';
import type { MotionValue } from '../../value/index.svelte';
import type { ResolvedValues } from '../types';
import { createBox } from '../../projection/geometry/models.svelte';
import type { IProjectionNode } from '../../projection/node/types';
import { isSVGTag } from './utils/is-svg-tag';
import type { VisualElement } from '../VisualElement.svelte';

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
