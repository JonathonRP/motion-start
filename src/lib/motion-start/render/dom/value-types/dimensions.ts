/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { fixed } from '../../../utils/fix-process-env.js';
import { number } from '../../../value/types/numbers';
import { degrees, percent, px, vh, vw } from '../../../value/types/numbers/units';
import { testValueType } from './test';
import { auto } from './type-auto';

/**
 * A list of value types commonly used for dimensions
 */
export const dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];

/**
 * Tests a dimensional value against the list of dimension ValueTypes
 */
export const findDimensionValueType = (v: unknown) => dimensionValueTypes.find(testValueType(v));
