/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VisualElement } from "../../render/types";
export interface MotionContextProps {
    visualElement?: VisualElement;
    initial?: false | string | string[];
    animate?: string | string[];
}

//@ts-ignore
export { MotionContext, useVisualElementContext, default as UseVisualElementContext } from "./MotionContext.svelte";

