/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { mirrorEasing } from './modifiers/mirror.js';
import { reverseEasing } from './modifiers/reverse.js';
import type { EasingFunction } from './types.js';

export const circIn: EasingFunction = (p) => 1 - Math.sin(Math.acos(p));
export const circOut = reverseEasing(circIn);
export const circInOut = mirrorEasing(circIn);
