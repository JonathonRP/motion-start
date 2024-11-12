/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Easing } from '../types';

export const isEasingArray = (ease: any): ease is Easing[] => {
	return Array.isArray(ease) && typeof ease[0] !== 'number';
};
