/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { defaultScaleCorrectors } from './default-scale-correctors.js';
import type { ScaleCorrectionDefinitionMap } from './scale-correction-types.js';

export const valueScaleCorrection: ScaleCorrectionDefinitionMap = defaultScaleCorrectors;

/**
 * @internal
 */
export function addScaleCorrection(correctors: ScaleCorrectionDefinitionMap): void {
	for (const key in correctors) {
		valueScaleCorrection[key] = correctors[key];
	}
}
