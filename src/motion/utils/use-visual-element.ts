/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionProps } from "../../motion/types";
import type { CreateVisualElement, VisualElement } from "../../render/types";
import type { VisualState } from "./use-visual-state";


export declare function useVisualElement<Instance, RenderState>(Component: string | React.ComponentType, visualState: VisualState<Instance, RenderState>, props: MotionProps, createVisualElement?: CreateVisualElement<Instance>): VisualElement<Instance> | undefined;

export { default as UseVisualElement } from './UseVisualElement.svelte';

