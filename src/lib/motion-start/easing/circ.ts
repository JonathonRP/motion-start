/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { mirrorEasing } from './modifiers/mirror';
import { reverseEasing } from './modifiers/reverse';
import type { EasingFunction } from './types';

export const circIn: EasingFunction = (p) => 1 - Math.sin(Math.acos(p));
export const circOut = reverseEasing(circIn);
export const circInOut = mirrorEasing(circIn);
