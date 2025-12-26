/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { color, complex } from '../../../value-types/index.js';
/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import { fixed } from '../../../utils/fix-process-env.js';
import { dimensionValueTypes } from './dimensions.js';
import { testValueType } from './test.js';

/**
 * A list of all ValueTypes
 */
var valueTypes = [...dimensionValueTypes, ...[color, complex]];
/**
 * Tests a value against the list of ValueTypes
 */
var findValueType = (v: any) =>
	valueTypes.find(testValueType(v)) as
		| import('style-value-types').ValueType
		| {
				test: (v: any) => boolean;
				parse: (v: string) => (number | import('style-value-types').RGBA | import('style-value-types').HSLA)[];
				createTransformer: (v: string) => (v: (string | number | import('style-value-types').Color)[]) => string;
				getAnimatableNone: (v: string) => string;
		  }
		| undefined;

export { findValueType };
