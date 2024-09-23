/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Check if value is a numerical string, ie a string that is purely a number eg "100" or "-100.1"
 */
var isNumericalString = function (v: string) { return /^\-?\d*\.?\d+$/.test(v); };

export { isNumericalString };
