/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { number } from '../../../value/types/numbers/index.js';
import { degrees, percent, px, vh, vw } from '../../../value/types/numbers/units.js';
import { testValueType } from './test.js';
import { auto } from './type-auto.js';

/**
 * A list of value types commonly used for dimensions
 */
export const dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];

/**
 * Tests a dimensional value against the list of dimension ValueTypes
 */
export const findDimensionValueType = (v: unknown) => dimensionValueTypes.find(testValueType(v));
