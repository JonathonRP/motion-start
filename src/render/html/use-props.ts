/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionProps } from "../../motion/types";
import { MotionValue } from "../../value";
import type { ResolvedValues } from "../types";

export declare function useStyle(props: MotionProps, visualState: ResolvedValues, isStatic: boolean): ResolvedValues;
export declare function useHTMLProps(props: MotionProps, visualState: ResolvedValues, isStatic: boolean): any;


export { copyRawValuesOnly, default as  UseStyle } from './UseStyle.svelte';
export {default as UseHTMLProps} from './UseHTMLProps.svelte'
