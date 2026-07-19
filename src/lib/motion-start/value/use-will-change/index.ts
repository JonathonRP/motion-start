/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { WillChangeMotionValue } from './WillChangeMotionValue.js';
import type { WillChange } from './types.js';

export function useWillChange(): WillChange {
	return new WillChangeMotionValue('auto');
}
