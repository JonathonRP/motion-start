/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { ValueType } from '../../../value/types/types';

/**
 * Tests a provided value against a ValueType
 */
export const testValueType = (v: unknown) => (type: ValueType) => type.test(v);
