/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { ValueTarget, KeyframesTarget } from '../../types';

export const isKeyframesTarget = (v: ValueTarget): v is KeyframesTarget => {
	return Array.isArray(v);
};
