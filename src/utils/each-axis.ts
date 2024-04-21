/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
// Call a handler once for each axis
function eachAxis<T>(handler: (axis: "x" | "y") => T): T[] {
    return [handler("x"), handler("y")];
}

export { eachAxis };
