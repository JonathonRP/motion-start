/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { FeatureProps } from "../features/types";

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

var makeRenderlessComponent = function <P = FeatureProps>(hook: Function) { return function (props: P) {
    hook(props);
    return null;
}; };

export { makeRenderlessComponent };
