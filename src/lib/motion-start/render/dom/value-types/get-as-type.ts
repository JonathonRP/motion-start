/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { ValueType } from '../../../value/types/types';

/**
 * Provided a value and a ValueType, returns the value as that value type.
 */
export const getValueAsType = (value: unknown, type?: ValueType) => {
	return type && typeof value === 'number' ? (type as any).transform(value) : value;
};
