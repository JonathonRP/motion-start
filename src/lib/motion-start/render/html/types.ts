/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { HTMLAttributes } from 'svelte/elements';
import type { MotionProps } from '../../motion/types';
import type { ResolvedValues } from '../types';
import type { HTMLElements } from './supported-elements';
import type { Component, Snippet } from 'svelte';
export interface TransformOrigin {
	originX?: number | string;
	originY?: number | string;
	originZ?: number | string;
}
export interface HTMLRenderState {
	/**
	 * A mutable record of transforms we want to apply directly to the rendered Element
	 * every frame. We use a mutable data structure to reduce GC during animations.
	 */
	transform: ResolvedValues;
	/**
	 * A mutable record of transform keys we want to apply to the rendered Element. We order
	 * this to order transforms in the desired order. We use a mutable data structure to reduce GC during animations.
	 */
	transformKeys: string[];
	/**
	 * A mutable record of transform origins we want to apply directly to the rendered Element
	 * every frame. We use a mutable data structure to reduce GC during animations.
	 */
	transformOrigin: TransformOrigin;
	/**
	 * A mutable record of styles we want to apply directly to the rendered Element
	 * every frame. We use a mutable data structure to reduce GC during animations.
	 */
	style: ResolvedValues;
	/**
	 * A mutable record of CSS variables we want to apply directly to the rendered Element
	 * every frame. We use a mutable data structure to reduce GC during animations.
	 */
	vars: ResolvedValues;
}
/**
 * @public
 */
export type ForwardRefComponent<T, P> = Snippet<[T & P]>;

/**
 * Motion-optimised versions of React's HTML components.
 *
 * @public
 */
export type HTMLMotionComponents = {
	[K in HTMLElements]: Component<MotionProps>;
};
