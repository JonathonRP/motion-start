/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { HTMLRenderState } from './types.js';
import type { DOMVisualElementOptions } from '../dom/types.js';
import { buildHTMLStyles } from './utils/build-styles.js';
import { isCSSVariableName } from '../dom/utils/is-css-variable.js';
import { transformProps } from './utils/transform.js';
import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.svelte.js';
import { renderHTML } from './utils/render.js';
import { getDefaultValueType } from '../dom/value-types/defaults.js';
import { measureViewportBox } from '../../projection/utils/measure.js';
import type { MotionProps } from '../../motion/types.js';
import type { Box } from '../../projection/geometry/types.js';
import { DOMVisualElement } from '../dom/DOMVisualElement.js';
import type { MotionConfigContext } from '../../context/MotionConfigContext.svelte.js';
import { isMotionValue } from '../../value/utils/is-motion-value.js';
import type { ResolvedValues } from '../types.js';
import type { VisualElement } from '../VisualElement.svelte.js';

export function getComputedStyle(element: HTMLElement) {
	return window.getComputedStyle(element);
}

export class HTMLVisualElement extends DOMVisualElement<HTMLElement, HTMLRenderState, DOMVisualElementOptions> {
	type = 'html';

	readValueFromInstance(instance: HTMLElement, key: string): string | number | null | undefined {
		if (transformProps.has(key)) {
			const defaultType = getDefaultValueType(key);
			return defaultType ? defaultType.default || 0 : 0;
		} else {
			const computedStyle = getComputedStyle(instance);
			const value =
				(isCSSVariableName(key)
					? computedStyle.getPropertyValue(key)
					: computedStyle[key as keyof typeof computedStyle]) || 0;

			return typeof value === 'string' ? value.trim() : (value as number);
		}
	}

	measureInstanceViewportBox(
		instance: HTMLElement,
		{ transformPagePoint }: MotionProps & Partial<MotionConfigContext>
	): Box {
		return measureViewportBox(instance, transformPagePoint);
	}

	build(renderState: HTMLRenderState, latestValues: ResolvedValues, props: MotionProps) {
		buildHTMLStyles(renderState, latestValues, props.transformTemplate);
	}

	scrapeMotionValuesFromProps(props: MotionProps, prevProps: MotionProps, visualElement: VisualElement<HTMLElement>) {
		return scrapeMotionValuesFromProps(props, prevProps, visualElement);
	}

	childSubscription?: VoidFunction;
	handleChildMotionValue() {
		if (this.childSubscription) {
			this.childSubscription();
			delete this.childSubscription;
		}

		const { children } = this.props;
		if (isMotionValue(children)) {
			this.childSubscription = children.on('change', (latest) => {
				if (this.current) this.current.textContent = `${latest}`;
			});
		}
	}

	renderInstance = renderHTML;
}
