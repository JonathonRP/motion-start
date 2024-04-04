/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { ValueType } from "style-value-types";
/**
 * Tests a provided value against a ValueType
 */
export declare const testValueType: (v: any) => (type: ValueType) => boolean;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Tests a provided value against a ValueType
 */
var testValueType = function (v) { return function (type) { return type.test(v); }; };

export { testValueType };
