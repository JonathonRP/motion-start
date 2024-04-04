/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { Writable } from 'svelte/store'
/**
 * @internal
 */
export declare const LayoutGroupContext: () => Writable<string | null>;

import { writable } from "svelte/store";
import { getDomContext } from "./DOMcontext";

/**
 * @internal
 */
export const LayoutGroupContext = (c)=>getDomContext("LayoutGroup",c)||writable(null);
