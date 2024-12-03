/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { color } from '../../../value/types/color';
import { complex } from '../../../value/types/complex';
import { dimensionValueTypes } from './dimensions';
import { testValueType } from './test';

/**
 * A list of all ValueTypes
 */
const valueTypes = [...dimensionValueTypes, color, complex];

/**
 * Tests a value against the list of ValueTypes
 */
export const findValueType = (v: unknown) => valueTypes.find(testValueType(v));
