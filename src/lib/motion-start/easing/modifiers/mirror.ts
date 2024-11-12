/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

// Accepts an easing function and returns a new one that outputs mirrored values for

import type { EasingModifier } from '../types';

// the second half of the animation. Turns easeIn into easeInOut.
export const mirrorEasing: EasingModifier = (easing) => (p) =>
	p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
