/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

// Accepts an easing function and returns a new one that outputs reversed values.

import type { EasingModifier } from '../types';

// Turns easeIn into easeOut.
export const reverseEasing: EasingModifier = (easing) => (p) => 1 - easing(1 - p);
