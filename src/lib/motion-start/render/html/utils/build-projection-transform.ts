/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { BoxDelta, Point2D } from "../../../types/geometry";
import type { ResolvedValues } from "../../types";
import type { LayoutState } from "../../utils/state";
export type BuildProjectionTransform = (box: BoxDelta, treeScale: Point2D, transform?: ResolvedValues) => string;
export type BuildProjectionTransformOrigin = (layout: LayoutState) => string;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { zeroLayout } from '../../utils/state.js';

/**
 * Build a transform style that takes a calculated delta between the element's current
 * space on screen and projects it into the desired space.
 */
function buildLayoutProjectionTransform({ x, y }: BoxDelta, treeScale: Point2D, latestTransform?: ResolvedValues): string {
    /**
     * The translations we use to calculate are always relative to the viewport coordinate space.
     * But when we apply scales, we also scale the coordinate space of an element and its children.
     * For instance if we have a treeScale (the culmination of all parent scales) of 0.5 and we need
     * to move an element 100 pixels, we actually need to move it 200 in within that scaled space.
     */
    var xTranslate = x.translate / treeScale.x;
    var yTranslate = y.translate / treeScale.y;
    var transform = "translate3d(" + xTranslate + "px, " + yTranslate + "px, 0) ";
    if (latestTransform) {
        var rotate = latestTransform.rotate, rotateX = latestTransform.rotateX, rotateY = latestTransform.rotateY;
        if (rotate)
            transform += "rotate(" + rotate + ") ";
        if (rotateX)
            transform += "rotateX(" + rotateX + ") ";
        if (rotateY)
            transform += "rotateY(" + rotateY + ") ";
    }
    transform += "scale(" + x.scale + ", " + y.scale + ")";
    return !latestTransform && transform === identityProjection ? "" : transform;
}
/**
 * Take the calculated delta origin and apply it as a transform string.
 */
function buildLayoutProjectionTransformOrigin({ deltaFinal, }: LayoutState) {
    return deltaFinal.x.origin * 100 + "% " + deltaFinal.y.origin * 100 + "% 0";
}
var identityProjection = buildLayoutProjectionTransform(zeroLayout.delta, zeroLayout.treeScale, { x: 1, y: 1 });

export { buildLayoutProjectionTransform, buildLayoutProjectionTransformOrigin, identityProjection };

