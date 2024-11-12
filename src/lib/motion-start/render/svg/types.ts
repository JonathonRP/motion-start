/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { SvelteHTMLElements, SVGAttributes } from 'svelte/elements';
import type { MakeMotion, MotionProps } from '../../motion/types';
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
}

export type SVGDimensions = {
	x: number;
	y: number;
	width: number;
	height: number;
};

interface SVGAttributesWithoutMotionProps<T extends EventTarget>
	extends Pick<SVGAttributes<T>, Exclude<keyof SVGAttributes<T>, keyof MotionProps>> {}

/**
 * Blanket-accept any SVG attribute as a `MotionValue`
 * @public
 */
export type SVGAttributesAsMotionValues<T extends EventTarget> = MakeMotion<SVGAttributesWithoutMotionProps<T>>;

export type UnwrapSVGFactoryElement<F> = F extends SVGAttributes<infer P> ? P : never;

/**
 * @public
 */
export interface SVGMotionProps<T extends EventTarget> extends SVGAttributesAsMotionValues<T>, MotionProps {}

/**
 * Motion-optimised versions of React's SVG components.
 *
 * @public
 */
export type SVGMotionComponents = {
	[K in SVGElements]: ForwardRefComponent<
		UnwrapSVGFactoryElement<SvelteHTMLElements[K]>,
		SVGMotionProps<UnwrapSVGFactoryElement<SvelteHTMLElements[K]>>
	>;
};
