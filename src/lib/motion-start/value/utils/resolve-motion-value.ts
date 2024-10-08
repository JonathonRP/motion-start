/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { MotionValue } from "..";
import type { CustomValueType } from "../../types";

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { isCustomValue } from '../../utils/resolve-value.js';
import { isMotionValue } from './is-motion-value.js';

/**
 * If the provided value is a MotionValue, this returns the actual value, otherwise just the value itself
 *
 * TODO: Remove and move to library
 *
 * @internal
 */
function resolveMotionValue(value?: string | number | CustomValueType | MotionValue): string | number {
    var unwrappedValue = isMotionValue(value) ? value.get() : value;
    return isCustomValue(unwrappedValue)
        ? unwrappedValue.toValue()
        : unwrappedValue;
}

export { resolveMotionValue };
