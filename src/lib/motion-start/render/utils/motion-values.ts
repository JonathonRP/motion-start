/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionStyle } from "../../motion/types";
import type { VisualElement } from "../types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { motionValue } from '../../value/index.js';
import { isMotionValue } from '../../value/utils/is-motion-value.js';

function updateMotionValuesFromProps(element: VisualElement, next: MotionStyle, prev: MotionStyle) {
    var _a;
    for (var key in next) {
        //@ts-ignore
        var nextValue = next[key];//@ts-ignore
        var prevValue = prev[key];
        if (isMotionValue(nextValue)) {
            /**
             * If this is a motion value found in props or style, we want to add it
             * to our visual element's motion value map.
             */
            element.addValue(key, nextValue);
        }
        else if (isMotionValue(prevValue)) {
            /**
             * If we're swapping to a new motion value, create a new motion value
             * from that
             */
            element.addValue(key, motionValue(nextValue));
        }
        else if (prevValue !== nextValue) {
            /**
             * If this is a flat value that has changed, update the motion value
             * or create one if it doesn't exist. We only want to do this if we're
             * not handling the value with our animation state.
             */
            if (element.hasValue(key)) {
                var existingValue = element.getValue(key);
                // TODO: Only update values that aren't being animated or even looked at
                existingValue?.hasAnimated && existingValue.set(nextValue);
            }
            else {
                element.addValue(key, motionValue((_a = element.getStaticValue(key)) !== null && _a !== void 0 ? _a : nextValue));
            }
        }
    }
    // Handle removed values
    for (var key in prev) {//@ts-ignore
        if (next[key] === undefined)
            element.removeValue(key);
    }
    return next;
}

export { updateMotionValuesFromProps };
