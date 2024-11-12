/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { AnimationType } from './types';

export const variantPriorityOrder: AnimationType[] = [
	'animate',
	'whileInView',
	'whileFocus',
	'whileHover',
	'whileTap',
	'whileDrag',
	'exit',
];

export const variantProps = ['initial', ...variantPriorityOrder];
