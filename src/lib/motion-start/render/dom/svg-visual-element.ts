/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { isMotionValue } from '../../value/utils/is-motion-value';
import { isTransformProp } from '../html/utils/transform';
import { htmlConfig } from '../html/visual-element';
import { visualElement } from '../index.js';
import type { SVGRenderState } from '../svg/types';
import { buildSVGAttrs } from '../svg/utils/build-attrs';
import { camelCaseAttributes } from '../svg/utils/camel-case-attrs';
import { camelToDash } from './utils/camel-to-dash';
import { getDefaultValueType } from './value-types/defaults';

const zeroDimensions = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
};

export const svgMutableState = () => ({
	//@ts-expect-error
	...htmlConfig.createRenderState(),
	attrs: {},
	dimensions: zeroDimensions,
});

export const svgVisualElement = visualElement({
	...htmlConfig,
	//@ts-expect-error
	createRenderState: svgMutableState,
	onMount(element: { scheduleRender: () => void }, instance: SVGGraphicsElement, mutableState: any) {
		try {
			mutableState.dimensions =
				typeof instance.getBBox === 'function' ? instance.getBBox() : instance.getBoundingClientRect();
		} catch (e) {
			// Most likely trying to measure an unrendered element under Firefox
			mutableState.dimensions = zeroDimensions;
		}

		if (isPath(instance)) {
			//@ts-expect-error
			mutableState.totalPathLength = instance.getTotalLength();
		}

		/**
		 * Ensure we render the element as soon as possible to reflect the measured dimensions.
		 * Preferably this would happen synchronously but we put it in rAF to prevent layout thrashing.
		 */
		element.scheduleRender();
	},

	getBaseTarget(props, key) {
		//@ts-expect-error
		return props[key];
	},

	readValueFromInstance(domElement, key) {
		if (isTransformProp(key)) {
			return getDefaultValueType(key)?.default || 0;
		}
		key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
		return domElement.getAttribute(key);
	},

	scrapeMotionValuesFromProps(props) {
		const newValues = htmlConfig.scrapeMotionValuesFromProps(props);

		for (let key in props) {
			//@ts-expect-error
			if (isMotionValue(props[key])) {
				if (key === 'x' || key === 'y') {
					key = 'attr' + key.toUpperCase();
				}
				//@ts-expect-error
				newValues[key] = props[key];
			}
		}

		return newValues;
	},

	build(_element, renderState, latestValues, projection, layoutState, options, props) {
		buildSVGAttrs(
			renderState as SVGRenderState,
			latestValues,
			projection,
			layoutState,
			options,
			props.transformTemplate
		);
	},

	render(element, mutableState) {
		htmlConfig.render(element, mutableState);
		//@ts-expect-error
		for (const key in mutableState.attrs) {
			element.setAttribute(
				!camelCaseAttributes.has(key) ? camelToDash(key) : key,
				//@ts-expect-error
				mutableState.attrs[key]
			);
		}
	},
});

function isPath(element: SVGGraphicsElement) {
	return element.tagName === 'path';
}
