/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { ValueTarget, KeyframesTarget } from "../../types";
export declare const isKeyframesTarget: (v: ValueTarget) => v is KeyframesTarget;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

var isKeyframesTarget = function (v) {
    return Array.isArray(v);
};

export { isKeyframesTarget };
