/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { DOMVisualElementOptions } from '../dom/types';
import type { VisualElementConfig } from '../types';
import type { HTMLRenderState } from './types';

/** 
based on framer-motion@4.1.15,
Copyright (c) 2018 Framer B.V.
*/
import { getBoundingBox } from '../dom/projection/measure.js';
import { isCSSVariable } from '../dom/utils/is-css-variable.js';
import { parseDomVariant } from '../dom/utils/parse-dom-variant.js';
import { getDefaultValueType } from '../dom/value-types/defaults.js';
import { visualElement } from '../index.js';
import { checkTargetForNewValues, getOrigin } from '../utils/setters.js';
import {
	buildLayoutProjectionTransform,
	buildLayoutProjectionTransformOrigin,
} from './utils/build-projection-transform.js';
import { buildHTMLStyles } from './utils/build-styles.js';
import { renderHTML } from './utils/render.js';
import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.js';
import { isTransformProp } from './utils/transform.js';

function getComputedStyle(element: HTMLElement) {
	return window.getComputedStyle(element);
}
var htmlConfig = {
	treeType: 'dom',
	readValueFromInstance: (domElement, key) => {
		if (isTransformProp(key)) {
			var defaultType = getDefaultValueType(key);
			return defaultType ? defaultType.default || 0 : 0;
		} else {
			var computedStyle = getComputedStyle(domElement);
			// @ts-expect-error
			return (isCSSVariable(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
		}
	},
	sortNodePosition: (a, b) => {
		/**
		 * compareDocumentPosition returns a bitmask, by using the bitwise &
		 * we're returning true if 2 in that bitmask is set to true. 2 is set
		 * to true if b preceeds a.
		 */
		return a.compareDocumentPosition(b) & 2 ? 1 : -1;
	},
	getBaseTarget: (props, key) => {
		var _a;// @ts-expect-error
		return (_a = props.style) === null || _a === void 0 ? void 0 : _a[key];
	},
	measureViewportBox: (element, _a) => {
		var transformPagePoint = _a.transformPagePoint;
		return getBoundingBox(element, transformPagePoint);
	},
	/**
	 * Reset the transform on the current Element. This is called as part
	 * of a batched process across the entire layout tree. To remove this write
	 * cycle it'd be interesting to see if it's possible to "undo" all the current
	 * layout transforms up the tree in the same way this.getBoundingBoxWithoutTransforms
	 * works
	 */
	resetTransform: (element, domElement, props) => {
		var transformTemplate = props.transformTemplate;
		domElement.style.transform = transformTemplate ? transformTemplate({}, '') : 'none';
		// Ensure that whatever happens next, we restore our transform on the next frame
		element.scheduleRender();
	},
	restoreTransform: (instance, mutableState) => {
		// @ts-expect-error
		instance.style.transform = mutableState.style.transform;
	},
	removeValueFromRenderState: (key, _a) => {
		var vars = _a.vars,
			style = _a.style;
		delete vars[key];
		delete style[key];
	},
	/**
	 * Ensure that HTML and Framer-specific value types like `px`->`%` and `Color`
	 * can be animated by Motion.
	 */
	makeTargetAnimatable: (element, _a, _b, isMounted) => {
		var transformValues = _b.transformValues;
		if (isMounted === void 0) {
			isMounted = true;
		}
		var { transition, transitionEnd, ...target } = _a;// @ts-expect-error
		var origin = getOrigin(target, transition || {}, element);
		/**
		 * If Framer has provided a function to convert `Color` etc value types, convert them
		 */
		if (transformValues) {
			if (transitionEnd) transitionEnd = transformValues(transitionEnd);
			if (target) target = transformValues(target);
			if (origin) origin = transformValues(origin);
		}
		if (isMounted) {
			checkTargetForNewValues(element, target, origin);// @ts-expect-error
			var parsed = parseDomVariant(element, target, origin, transitionEnd);
			transitionEnd = parsed.transitionEnd;
			target = parsed.target;
		}
		return Object.assign({ transition: transition, transitionEnd: transitionEnd }, target);
	},
	scrapeMotionValuesFromProps: scrapeMotionValuesFromProps,
	build: (element, renderState, latestValues, projection, layoutState, options, props) => {
		if (element.isVisible !== undefined) {
			renderState.style.visibility = element.isVisible ? 'visible' : 'hidden';
		}
		var isProjectionTranform = projection.isEnabled && layoutState.isHydrated;
		buildHTMLStyles(
			renderState,
			latestValues,
			projection,
			layoutState,
			options,
			props.transformTemplate,
			isProjectionTranform ? buildLayoutProjectionTransform : undefined,
			isProjectionTranform ? buildLayoutProjectionTransformOrigin : undefined
		);
	},
	render: renderHTML,
} satisfies VisualElementConfig<HTMLElement, HTMLRenderState, DOMVisualElementOptions>;
var htmlVisualElement = visualElement<HTMLElement>(htmlConfig);

export { getComputedStyle, htmlConfig, htmlVisualElement };
