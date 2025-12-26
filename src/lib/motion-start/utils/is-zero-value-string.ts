/**
 * Checks if a value is a zero value string like '0px' or '0%'
 * @param v - String to check
 * @returns True if the string represents a zero value with a unit
 */
export const isZeroValueString = (v: string) => /^0[^.\s]+$/u.test(v);
