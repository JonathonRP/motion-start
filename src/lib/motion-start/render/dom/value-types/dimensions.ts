/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { degrees, number, percent, px, vh, vw } from '../../../value-types/index.js';
import type { CustomValueType } from '../../../types.js';
/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import { fixed } from '../../../utils/fix-process-env.js';
import { testValueType } from './test.js';
import { auto } from './type-auto.js';

/**
 * A list of value types commonly used for dimensions
 */
var dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
/**
 * Tests a dimensional value against the list of dimension ValueTypes
 */
var findDimensionValueType = (v: string | number | CustomValueType | null) =>
	dimensionValueTypes.find(testValueType(v));

export { dimensionValueTypes, findDimensionValueType };
