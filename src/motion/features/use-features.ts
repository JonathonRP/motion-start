/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionProps } from "../..";
export type isForcedMotionValue = (key: string, { layout, layoutId }: MotionProps) => boolean;


/**
 * Load features via renderless components based on the provided MotionProps.
 * TODO: Look into porting this to a component-less appraoch.
 */


export { default as UseFeatures } from './UseFeatures.svelte';

