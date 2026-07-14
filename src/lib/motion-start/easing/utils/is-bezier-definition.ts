/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { BezierDefinition, Easing } from '../types';

export const isBezierDefinition = (easing: Easing | Easing[]): easing is BezierDefinition =>
	Array.isArray(easing) && typeof easing[0] === 'number';
