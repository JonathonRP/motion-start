/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionProps } from "../../motion/types";
import type { ResolvedValues } from "../types";

export type useStyle = (props: MotionProps, visualState: ResolvedValues, isStatic: boolean) => ResolvedValues;
export type useHTMLProps = (props: MotionProps, visualState: ResolvedValues, isStatic: boolean) => any;


export { default as UseHTMLProps } from './UseHTMLProps.svelte';
export { default as UseStyle, copyRawValuesOnly } from './UseStyle.svelte';

