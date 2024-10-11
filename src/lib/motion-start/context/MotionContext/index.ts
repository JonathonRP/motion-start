/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VisualElement } from "../../render/types";
import { getContext } from "svelte";
import { getDomContext } from "../DOMcontext";
import { writable } from "svelte/store";

export interface MotionContextProps {
	forEach?: any;
    visualElement?: VisualElement;
    initial?: false | string | string[];
    animate?: string | string[];
}

export const MotionContext = (c?: any) =>
    getDomContext("Motion", c) || writable<MotionContextProps>({});

  export const useVisualElementContext = (c?: any) => {
    return (getContext(MotionContext) || MotionContext(c)) as
      | VisualElement<any, any>
      | undefined;
  };

export { default as UseVisualElementContext } from "./MotionContext.svelte";

