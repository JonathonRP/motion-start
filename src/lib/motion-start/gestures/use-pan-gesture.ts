/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { FeatureProps } from "../motion/features/types";
/**
 *
 * @param handlers -
 * @param ref -
 *
 * @internalremarks
 * Currently this sets new pan gesture functions every render. The memo route has been explored
 * in the past but ultimately we're still creating new functions every render. An optimisation
 * to explore is creating the pan gestures and loading them into a `ref`.
 *
 * @internal
 */
export type usePanGesture = ({ onPan, onPanStart, onPanEnd, onPanSessionStart, visualElement, }: FeatureProps | any) => void;


export { default as UsePanGesture } from './UsePanGesture.svelte';

