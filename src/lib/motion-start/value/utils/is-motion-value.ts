/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionValue } from "..";

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
var isMotionValue = function (value: any): value is MotionValue {
    return value !== null && typeof value === "object" && value.getVelocity;
};

export { isMotionValue };
