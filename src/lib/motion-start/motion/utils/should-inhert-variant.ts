/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionProps } from '../types';

export function checkShouldInheritVariant({ animate, variants, inherit }: MotionProps): boolean {
	return inherit !== undefined ? inherit : !!variants && !animate;
}
