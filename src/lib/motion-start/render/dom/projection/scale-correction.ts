/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { ScaleCorrectionDefinitionMap } from './types';
import { defaultScaleCorrectors } from './default-scale-correctors';

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
var valueScaleCorrection: ScaleCorrectionDefinitionMap = defaultScaleCorrectors;
/**
 * @internal
 */
function addScaleCorrection(correctors: ScaleCorrectionDefinitionMap) {
	for (var key in correctors) {
		valueScaleCorrection[key] = correctors[key];
	}
}

export { addScaleCorrection, valueScaleCorrection };
