/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * Check if value is a numerical string, ie a string that is purely a number eg "100" or "-100.1"
 */
export const isNumericalString = (v: string) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
