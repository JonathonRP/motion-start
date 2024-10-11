/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Writable } from 'svelte/store'

import { writable } from "svelte/store";
import { getDomContext } from "./DOMcontext";

/**
 * @internal
 */
// @ts-expect-error
export const LayoutGroupContext = (c?: any): Writable<string | null> => getDomContext("LayoutGroup",c)||writable(null);
