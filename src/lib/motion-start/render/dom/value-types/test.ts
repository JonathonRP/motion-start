/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { ValueType } from '../../../value-types/index.js';

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Tests a provided value against a ValueType
 */
var testValueType = (v: any) => (type: ValueType) => type.test(v);

export { testValueType };
