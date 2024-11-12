/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Axis, AxisDelta, Box, Delta } from './types';

export const createAxisDelta = (): AxisDelta => ({
	translate: 0,
	scale: 1,
	origin: 0,
	originPoint: 0,
});

export const createDelta = (): Delta => ({
	x: createAxisDelta(),
	y: createAxisDelta(),
});

export const createAxis = (): Axis => ({ min: 0, max: 0 });

export const createBox = (): Box => ({
	x: createAxis(),
	y: createAxis(),
});
