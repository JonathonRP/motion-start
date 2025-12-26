/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionProps } from "../../motion/types";
import type { ResolvedValues } from "../types";
export type useSVGProps = (props: MotionProps, visualState: ResolvedValues) => {
    style: {
        [x: string]: string | number;
    };
};

export { default as UseSVGProps } from './UseSVGProps.svelte';

