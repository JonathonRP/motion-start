/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VariantLabels } from "../motion/types";
import type { Writable } from 'svelte/store'
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

import { writable } from "svelte/store";
import { getDomContext } from "./DOMcontext";


/**
 * @public
 */
export const PresenceContext = (c?: any): Writable<PresenceContextProps | null> => getDomContext("Presence", c) || writable(null);
