/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * Convert camelCase to dash-case properties.
 */
export const camelToDash = (str: string) => str.replace(/([a-z])([A-Z])/gu, '$1-$2').toLowerCase();
