/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { DOMMotionComponents } from './types.js';
// import type { CustomMotionComponentConfig} from './motion-proxy.js'
// import type { MotionProps } from "../../motion/types.js";

export interface IsSVG {
	/** set to true if the component receiving the motion action is an svg-element like `circle` or `path`. Should not be set to true for `svg` tags. */
	isSVG?: boolean;
}

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { createMotionComponent } from '../../motion/index.js';
// import { createMotionClass } from './create-motion-class.js';
import { createDomVisualElement } from './create-visual-element.js';
import { featureBundle } from './featureBundle.js';
import { createMotionProxy } from './motion-proxy.js';

/**
 * HTML & SVG components, optimised for use with gestures and animation. These can be used as
 * drop-in replacements for any HTML & SVG component, all CSS & SVG properties are supported.
 *
 * @public
 */
var motion = /*@__PURE__*/ createMotionProxy(featureBundle);

/**
 * Create a DOM `motion` component with the provided string. This is primarily intended
 * as a full alternative to `motion` for consumers who have to support environments that don't
 * support `Proxy`.
 *
 * ```javascript
 * import { createDomMotionComponent } from "framer-motion"
 *
 * const motion = {
 *   div: createDomMotionComponent('div')
 * }
 * ```
 *
 * @public
 */
function createDomMotionComponent<T extends keyof DOMMotionComponents>(key: T): DOMMotionComponents[T] {
	var config = {
		createVisualElement: createDomVisualElement(key),
		// useRender: createUseRender(key, false),
		// @ts-expect-error
		forwardMotionProps: key.forwardMotionProps,
		// @ts-expect-error
		Component: key.Component,
		// @ts-expect-error
		defaultFeatures: allMotionFeatures,
	};

	// @ts-expect-error
	return createMotionComponent(config);
}

export { motion, createDomMotionComponent };
