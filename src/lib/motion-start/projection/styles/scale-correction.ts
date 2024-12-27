/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { ScaleCorrectorMap } from './types';

export const scaleCorrectors: ScaleCorrectorMap = {};

export function addScaleCorrector(correctors: ScaleCorrectorMap) {
	Object.assign(scaleCorrectors, correctors);
}
