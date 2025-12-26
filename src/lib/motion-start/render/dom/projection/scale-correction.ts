/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { defaultScaleCorrectors } from './default-scale-correctors';
import type { ScaleCorrectionDefinitionMap } from './types';

/** 
based on framer-motion@11.11.11,
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
