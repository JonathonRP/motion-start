/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { MotionValue } from "../";
export declare const isMotionValue: (value: any) => value is MotionValue<any>;

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
var isMotionValue = function (value) {
    return value !== null && typeof value === "object" && value.getVelocity;
};

export { isMotionValue };
