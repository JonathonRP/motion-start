/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
/**
 * A list of value types commonly used for dimensions
 */
export declare const dimensionValueTypes: import("style-value-types").ValueType[];
/**
 * Tests a dimensional value against the list of dimension ValueTypes
 */
export declare const findDimensionValueType: (v: any) => import("style-value-types").ValueType | undefined;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import {fixed} from '../../../utils/fix-process-env.js';
import { number, px, percent, degrees, vw, vh } from 'style-value-types';
import { testValueType } from './test.js';
import { auto } from './type-auto.js';

/**
 * A list of value types commonly used for dimensions
 */
var dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
/**
 * Tests a dimensional value against the list of dimension ValueTypes
 */
var findDimensionValueType = function (v) {
    return dimensionValueTypes.find(testValueType(v));
};

export { dimensionValueTypes, findDimensionValueType };