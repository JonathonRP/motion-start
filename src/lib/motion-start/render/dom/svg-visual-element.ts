/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { visualElement } from '../index.js';
import { isMotionValue } from '../../value/utils/is-motion-value';
import { htmlConfig } from '../html/visual-element';
import { buildSVGAttrs } from '../svg/utils/build-attrs';
import { camelToDash } from './utils/camel-to-dash';
import { camelCaseAttributes } from '../svg/utils/camel-case-attrs';
import { isTransformProp } from '../html/utils/transform';
import { getDefaultValueType } from './value-types/defaults';
import type { SVGRenderState } from '../svg/types';

const zeroDimensions = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
};

export const svgMutableState = () => ({
	//@ts-ignore
	...htmlConfig.createRenderState(),
	attrs: {},
	dimensions: zeroDimensions,
});

export const svgVisualElement = visualElement({
	...htmlConfig,
	//@ts-ignore
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
			//@ts-ignore
			mutableState.totalPathLength = instance.getTotalLength();
		}

		/**
		 * Ensure we render the element as soon as possible to reflect the measured dimensions.
		 * Preferably this would happen synchronously but we put it in rAF to prevent layout thrashing.
		 */
		//@ts-ignore
		element.scheduleRender();
	},

	getBaseTarget(props, key) {
		//@ts-ignore
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
			//@ts-ignore
			if (isMotionValue(props[key])) {
				if (key === 'x' || key === 'y') {
					key = 'attr' + key.toUpperCase();
				}
				//@ts-ignore
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
		//@ts-ignore
		for (const key in mutableState.attrs) {
			element.setAttribute(
				!camelCaseAttributes.has(key) ? camelToDash(key) : key,
				//@ts-ignore
				mutableState.attrs[key]
			);
		}
	},
});

function isPath(element: SVGGraphicsElement) {
	return element.tagName === 'path';
}
