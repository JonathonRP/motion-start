/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Axis, AxisDelta, Box, Delta } from './types.js';

export function createAxis(): Axis {
	return { min: 0, max: 0 };
}

export function createBox(): Box {
	return {
		x: createAxis(),
		y: createAxis(),
	};
}

export function createAxisDelta(): AxisDelta {
	return {
		translate: 0,
		scale: 1,
		origin: 0,
		originPoint: 0,
	};
}

export function createDelta(): Delta {
	return {
		x: createAxisDelta(),
		y: createAxisDelta(),
	};
}
