/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * Check if the value is a zero value string like "0px" or "0%"
 */
export const isZeroValueString = (v: string) => /^0[^.\s]+$/u.test(v);
