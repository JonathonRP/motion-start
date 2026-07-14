/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { isZeroValueString } from '../../utils/is-zero-value-string';

export function isNone(value: string | number | null) {
	if (typeof value === 'number') {
		return value === 0;
	} else if (value !== null) {
		return value === 'none' || value === '0' || isZeroValueString(value);
	} else {
		return true;
	}
}
