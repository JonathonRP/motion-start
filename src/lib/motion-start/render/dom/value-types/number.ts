/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { alpha } from '../../../value/types/numbers/index.js';
import { px } from '../../../value/types/numbers/units.js';
import { browserNumberValueTypes } from './number-browser.js';
import { transformValueTypes } from './transform.js';
import { int } from './type-int.js';
import type { ValueTypeMap } from './types.js';

export const numberValueTypes: ValueTypeMap = {
	...browserNumberValueTypes,
	...transformValueTypes,
	zIndex: int,
	size: px,

	// SVG
	fillOpacity: alpha,
	strokeOpacity: alpha,
	numOctaves: int,
};
