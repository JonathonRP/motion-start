/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { SVGDimensions } from "../types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import {fixed} from '../../../utils/fix-process-env';
import { px } from 'style-value-types';

function calcOrigin(origin: number, offset: number, size: number) {
    return typeof origin === "string"
        ? origin
        : px.transform?.(offset + size * origin);
}
/**
 * The SVG transform origin defaults are different to CSS and is less intuitive,
 * so we use the measured dimensions of the SVG to reconcile these.
 */
function calcSVGTransformOrigin(dimensions: SVGDimensions, originX: number | string, originY: number | string) {
    var pxOriginX = calcOrigin(originX as number, dimensions.x, dimensions.width);
    var pxOriginY = calcOrigin(originY as number, dimensions.y, dimensions.height);
    return pxOriginX + " " + pxOriginY;
}

export { calcSVGTransformOrigin };
