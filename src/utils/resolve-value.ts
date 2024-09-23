/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { CustomValueType, ValueTarget, SingleTarget } from "../types";
// export declare const isCustomValue: (v: any) => v is CustomValueType;
// export declare const resolveFinalValueInKeyframes: (v: ValueTarget) => SingleTarget;

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { isKeyframesTarget } from '../animation/utils/is-keyframes-target.js';

var isCustomValue = function (v: any): v is CustomValueType {
    return Boolean(v && typeof v === "object" && v.mix && v.toValue);
};
var resolveFinalValueInKeyframes = function (v: ValueTarget): SingleTarget {
    // TODO maybe throw if v.length - 1 is placeholder token?
    return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
};

export { isCustomValue, resolveFinalValueInKeyframes };
