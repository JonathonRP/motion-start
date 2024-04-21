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
 * ValueType for "auto"
 */
var auto = {
    test: function (v) { return v === "auto"; },
    parse: function (v) { return v; },
} as ValueType;

export { auto };
