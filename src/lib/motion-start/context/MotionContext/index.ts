/**
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VisualElement } from "../../render/types";
import { getContext } from "svelte";
import { getDomContext } from "../DOMcontext";

export interface MotionContextProps {
    forEach?: any;
    visualElement?: VisualElement;
    initial?: false | string | string[];
    animate?: string | string[];
}

/**
 * Context key for Motion
 * @public
 */
export const MOTION_CONTEXT_KEY = Symbol('MotionContext');

export const MotionContext = (c?: any): MotionContextProps => {
    const domContext = getDomContext("Motion", c);
    return (domContext || {}) as MotionContextProps;
};

export const useVisualElementContext = (c?: any) => {
    return (getContext(MOTION_CONTEXT_KEY) || MotionContext(c)) as
        | VisualElement<any, any>
        | undefined;
};

export { default as UseVisualElementContext } from "./MotionContext.svelte";

