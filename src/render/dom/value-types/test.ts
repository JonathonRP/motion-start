/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { ValueType } from "style-value-types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Tests a provided value against a ValueType
 */
var testValueType = function (v: any) { return function (type: ValueType) { return type.test(v); }; };

export { testValueType };
