/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { HTMLRenderState } from './types';
import type { DOMVisualElementOptions } from '../dom/types';
import { buildHTMLStyles } from './utils/build-styles';
import { isCSSVariableName } from '../dom/utils/is-css-variable';
import { transformProps } from './utils/transform';
import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values';
import { renderHTML } from './utils/render';
import { getDefaultValueType } from '../dom/value-types/defaults';
import { measureViewportBox } from '../../projection/utils/measure';
import type { MotionProps } from '../../motion/types';
import type { Box } from '../../projection/geometry/types';
import { DOMVisualElement } from '../dom/DOMVisualElement';
import type { MotionConfigContext } from '../../context/MotionConfigContext';
import { isMotionValue } from '../../value/utils/is-motion-value';
import type { ResolvedValues } from '../types';
import type { VisualElement } from '../VisualElement.svelte';

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