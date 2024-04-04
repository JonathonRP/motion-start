/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { ScaleCorrectionDefinitionMap } from "./types";
export declare const valueScaleCorrection: ScaleCorrectionDefinitionMap;
/**
 * @internal
 */
export declare function addScaleCorrection(correctors: ScaleCorrectionDefinitionMap): void;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
var valueScaleCorrection = {};
/**
 * @internal
 */
function addScaleCorrection(correctors) {
    for (var key in correctors) {
        valueScaleCorrection[key] = correctors[key];
    }
}

export { addScaleCorrection, valueScaleCorrection };
