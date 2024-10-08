/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { ResolvedValueTarget } from "../../types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import {fixed} from '../../utils/fix-process-env';
import { complex } from 'style-value-types';

/**
 * Check if a value is animatable. Examples:
 *
 * ✅: 100, "100px", "#fff"
 * ❌: "block", "url(2.jpg)"
 * @param value
 *
 * @internal
 */
var isAnimatable = function (key: string, value: ResolvedValueTarget) {
    // If the list of keys tat might be non-animatable grows, replace with Set
    if (key === "zIndex")
        return false;
    // If it's a number or a keyframes array, we can animate it. We might at some point
    // need to do a deep isAnimatable check of keyframes, or let Popmotion handle this,
    // but for now lets leave it like this for performance reasons
    if (typeof value === "number" || Array.isArray(value))
        return true;
    if (typeof value === "string" && // It's animatable if we have a string
        complex.test(value) && // And it contains numbers and/or colors
        !value.startsWith("url(") // Unless it starts with "url("
    ) {
        return true;
    }
    return false;
};

export { isAnimatable };
