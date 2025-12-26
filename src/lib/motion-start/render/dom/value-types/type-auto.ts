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
 * ValueType for "auto"
 */
var auto = {
	test: (v) => v === 'auto',
	parse: (v) => v,
} as ValueType;

export { auto };
