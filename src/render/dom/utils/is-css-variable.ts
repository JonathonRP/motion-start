/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Returns true if the provided key is a CSS variable
 */
function isCSSVariable(key: string) {
    return key.startsWith("--");
}

export { isCSSVariable };
