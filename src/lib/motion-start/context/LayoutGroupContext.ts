/**
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { getDomContext } from "./DOMcontext";

/**
 * Context key for LayoutGroup
 * @internal
 */
export const LAYOUT_GROUP_CONTEXT_KEY = Symbol('LayoutGroupContext');

/**
 * @internal
 */
export const LayoutGroupContext = (c?: any): string | null => {
    const domContext = getDomContext("LayoutGroup", c);
    return domContext || null;
};
