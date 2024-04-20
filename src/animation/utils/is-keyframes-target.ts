/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { ValueTarget, KeyframesTarget } from "../../types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

const isKeyframesTarget = (v: ValueTarget): v is KeyframesTarget => {
    return Array.isArray(v);
};

export { isKeyframesTarget };
