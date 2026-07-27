/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

// If this number is a decimal, make it just five decimal places
// to avoid exponents
export const sanitize = (v: number) => Math.round(v * 100000) / 100000;
