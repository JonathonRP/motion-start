/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { KeyframesTarget, ValueTarget } from '../../types';

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

const isKeyframesTarget = (v: ValueTarget): v is KeyframesTarget => {
	return Array.isArray(v);
};

export { isKeyframesTarget };
