/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { WillChangeMotionValue } from './WillChangeMotionValue';
import type { WillChange } from './types';

export function useWillChange(): WillChange {
	return new WillChangeMotionValue('auto');
}
