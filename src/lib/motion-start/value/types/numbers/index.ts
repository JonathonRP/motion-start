/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { clamp } from '../../../utils/clamp';

export const number = {
	test: (v: number) => typeof v === 'number',
	parse: Number.parseFloat,
	transform: (v: number) => v,
};

export const alpha = {
	...number,
	transform: (v: number) => clamp(0, 1, v),
};

export const scale = {
	...number,
	default: 1,
};
