/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { RenderComponent } from "../../motion/features/types";
import type { HTMLRenderState } from "../html/types";
import type { SVGRenderState } from "../svg/types";
export declare function createUseRender(forwardMotionProps?: boolean): RenderComponent<SVGElement | HTMLElement, HTMLRenderState | SVGRenderState>;

export { default as UseRender } from './UseRender.svelte';
