/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { wrap } from '../../utils/wrap';
import type { Easing } from '../types';
import { isEasingArray } from './is-easing-array';

export function getEasingForSegment(easing: Easing | Easing[], i: number): Easing {
	return isEasingArray(easing) ? easing[wrap(0, easing.length, i)] : easing;
}
