/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { fixed } from '../../../utils/fix-process-env';
import { number } from '../../../value/types/numbers';

export const int = {
	...number,
	transform: Math.round,
};
