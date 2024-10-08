/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionProps } from "../../../motion/types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { isValidMotionProp } from '../../../motion/utils/valid-prop.js';

var shouldForward = function (key: string) { return !isValidMotionProp(key); };
/**
 * Emotion and Styled Components both allow users to pass through arbitrary props to their components
 * to dynamically generate CSS. They both use the `@emotion/is-prop-valid` package to determine which
 * of these should be passed to the underlying DOM node.
 *
 * However, when styling a Motion component `styled(MotionDiv)`, both packages pass through *all* props
 * as it's seen as an arbitrary component rather than a DOM node. Motion only allows arbitrary props
 * passed through the `custom` prop so it doesn't *need* the payload or computational overhead of
 * `@emotion/is-prop-valid`, however to fix this problem we need to use it.
 *
 * By making it an optionalDependency we can offer this functionality only in the situations where it's
 * actually required.
 */
try {
    var emotionIsPropValid_1 = require("@emotion/is-prop-valid").default;
    shouldForward = function (key) {
        // Handle events explicitly as Emotion validates them all as true
        if (key.startsWith("on")) {
            return !isValidMotionProp(key);
        }
        else {
            return emotionIsPropValid_1(key);
        }
    };
}
catch (_a) {
    // We don't need to actually do anything here - the fallback is the existing `isPropValid`.
}
function filterProps(props: MotionProps, isDom: boolean, forwardMotionProps: boolean) {
    var filteredProps = {};
    for (var key in props) {
        if (shouldForward(key) ||
            (forwardMotionProps === true && isValidMotionProp(key)) ||
            (!isDom && !isValidMotionProp(key))) {
                //@ts-ignore
            filteredProps[key] = props[key];
        }
    }
    return filteredProps;
}

export { filterProps };
