/**
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VariantLabels } from "../motion/types";

/**
 * @public
 */
export interface PresenceContextProps {
    id: number;
    isPresent: boolean;
    register: (id: number) => () => void;
    onExitComplete?: (id: number) => void;
    initial?: false | VariantLabels;
    custom?: any;
}

import { getDomContext } from "./DOMcontext";

/**
 * Context key for Presence
 * @public
 */
export const PRESENCE_CONTEXT_KEY = Symbol('PresenceContext');

/**
 * @public
 */
export const PresenceContext = (c?: any): PresenceContextProps | null => {
    const domContext = getDomContext("Presence", c);
    return (domContext || null) as PresenceContextProps | null;
};
