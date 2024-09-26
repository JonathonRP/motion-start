import type { Writable } from "svelte/store";
import type { MotionContextProps } from "./MotionContext";

export const getDomContext = (name: string, el: any): Writable<MotionContextProps> | undefined => {
    if (!el || !window) {
        return undefined;
    }
    let par = el;
    while (par = par.parentNode) {
        if (par.motionDomContext && par.motionDomContext.has(name)) {
            return par.motionDomContext.get(name)
        }
    }
    return undefined;
}

export const setDomContext = (name: string, el: any, value: any) => {
    if (el && window) {
        if (!el.motionDomContext) {
            el.motionDomContext = new Map();
        }
        el.motionDomContext.set(name, value);
    }
}