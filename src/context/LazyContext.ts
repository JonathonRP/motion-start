/// <reference types="react" />
/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { CreateVisualElement } from "../render/types";
export interface LazyContextProps {
    renderer?: CreateVisualElement<any>;
    strict: boolean;
}
export declare const LazyContext: import("react").Context<LazyContextProps>;


import { writable } from "svelte/store";
import { getDomContext } from "./DOMcontext";


const LazyContext = (c) => getDomContext("Lazy",c) || writable({ strict: false });

export { LazyContext };
