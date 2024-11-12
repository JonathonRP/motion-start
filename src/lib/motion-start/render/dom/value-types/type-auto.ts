/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { ValueType } from '../../../value/types/types';

/**
 * ValueType for "auto"
 */
export const auto: ValueType = {
	test: (v: unknown) => v === 'auto',
	parse: (v) => v,
};
