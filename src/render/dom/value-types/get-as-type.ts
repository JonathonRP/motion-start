/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { ValueType } from "style-value-types";
/**
 * Provided a value and a ValueType, returns the value as that value type.
 */
export declare const getValueAsType: (value: any, type?: ValueType | undefined) => any;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Provided a value and a ValueType, returns the value as that value type.
 */
var getValueAsType = function (value, type) {
    return type && typeof value === "number"
        ? type.transform(value)
        : value;
};

export { getValueAsType };
