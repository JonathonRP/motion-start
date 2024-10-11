/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { SvelteHTMLElements } from 'svelte/elements';
import type { MotionProps } from '../../motion/types';
import type { ForwardRefComponent, HTMLRenderState } from '../html/types';
import type { ResolvedValues } from '../types';
import type { SVGElements } from './supported-elements';
export interface SVGRenderState extends HTMLRenderState {
	/**
	 * Measured dimensions of the SVG element to be used to calculate a transform-origin.
	 */
	dimensions?: SVGDimensions;
	/**
	 * A mutable record of attributes we want to apply directly to the rendered Element
	 * every frame. We use a mutable data structure to reduce GC during animations.
	 */
	attrs: ResolvedValues;
	/**
	 * Measured path length if this is a SVGPathElement
	 */
	totalPathLength?: number;
}
export type SVGDimensions = {
	x: number;
	y: number;
	width: number;
	height: number;
};

/**
 * Motion-optimised versions of React's SVG components.
 *
 * @public
 */
export type SVGMotionComponents = {
	[K in SVGElements]: ForwardRefComponent<MotionProps, SvelteHTMLElements[K]>;
};
