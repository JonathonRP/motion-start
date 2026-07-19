/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { color } from '../../../value/types/color/index.js';
import { complex } from '../../../value/types/complex/index.js';
import { dimensionValueTypes } from './dimensions.js';
import { testValueType } from './test.js';

/**
 * A list of all ValueTypes
 */
const valueTypes = [...dimensionValueTypes, color, complex];

/**
 * Tests a value against the list of ValueTypes
 */
export const findValueType = (v: unknown) => valueTypes.find(testValueType(v));
