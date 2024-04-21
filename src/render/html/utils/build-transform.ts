/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { DOMVisualElementOptions } from "../../dom/types";
import type { MotionProps } from "../../../motion/types";
import type { HTMLRenderState, TransformOrigin } from "../types";
/**
 * Build a CSS transform style from individual x/y/scale etc properties.
 *
 * This outputs with a default order of transforms/scales/rotations, this can be customised by
 * providing a transformTemplate function.
 */
// export declare function buildTransform(): string;
/**
 * Build a transformOrigin style. Uses the same defaults as the browser for
 * undefined origins.
 */
// export declare function buildTransformOrigin(): string;

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { sortTransformProps } from './transform.js';

var translateAlias = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective",
};
/**
 * Build a CSS transform style from individual x/y/scale etc properties.
 *
 * This outputs with a default order of transforms/scales/rotations, this can be customised by
 * providing a transformTemplate function.
 */
function buildTransform({ transform, transformKeys }: HTMLRenderState, { enableHardwareAcceleration, allowTransformNone, }: DOMVisualElementOptions, transformIsDefault: boolean, transformTemplate?: MotionProps["transformTemplate"]) {
    // The transform string we're going to build into.
    var transformString = "";
    // Transform keys into their default order - this will determine the output order.
    transformKeys.sort(sortTransformProps);
    // Track whether the defined transform has a defined z so we don't add a
    // second to enable hardware acceleration
    var transformHasZ = false;
    // Loop over each transform and build them into transformString
    var numTransformKeys = transformKeys.length;
    for (var i = 0; i < numTransformKeys; i++) {
        var key = transformKeys[i];
        transformString += (translateAlias[key] || key) + "(" + transform[key] + ") ";
        if (key === "z")
            transformHasZ = true;
    }
    if (!transformHasZ && enableHardwareAcceleration) {
        transformString += "translateZ(0)";
    }
    else {
        transformString = transformString.trim();
    }
    // If we have a custom `transform` template, pass our transform values and
    // generated transformString to that before returning
    if (transformTemplate) {
        transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
    }
    else if (allowTransformNone && transformIsDefault) {
        transformString = "none";
    }
    return transformString;
}
/**
 * Build a transformOrigin style. Uses the same defaults as the browser for
 * undefined origins.
 */
function buildTransformOrigin({ originX = "50%", originY = "50%", originZ = 0, }: TransformOrigin) {
    return originX + " " + originY + " " + originZ;
}

export { buildTransform, buildTransformOrigin };
