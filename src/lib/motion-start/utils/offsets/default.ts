/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { fillOffset } from './fill';

export function defaultOffset(arr: unknown[]): number[] {
	const offset = [0];
	fillOffset(offset, arr.length - 1);
	return offset;
}
