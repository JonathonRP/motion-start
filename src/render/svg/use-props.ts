/** 
based on framer-motion@4.1.17,
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

