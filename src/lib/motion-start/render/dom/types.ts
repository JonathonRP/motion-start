/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { HTMLMotionComponents } from '../html/types';
import type { SVGMotionComponents } from '../svg/types';

export interface DOMVisualElementOptions {
	/**
	 * If `true`, this element will be included in the projection tree.
	 *
	 * Default: `true`
	 *
	 * @public
	 */
	allowProjection?: boolean;

	/**
	 * Allow this element to be GPU-accelerated. We currently enable this by
	 * adding a `translateZ(0)`.
	 *
	 * @public
	 */
	enableHardwareAcceleration?: boolean;
}

export interface DOMMotionComponents extends HTMLMotionComponents, SVGMotionComponents {}
