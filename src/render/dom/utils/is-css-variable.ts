/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Returns true if the provided key is a CSS variable
 */
export declare function isCSSVariable(key: string): boolean;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Returns true if the provided key is a CSS variable
 */
function isCSSVariable(key) {
    return key.startsWith("--");
}

export { isCSSVariable };
