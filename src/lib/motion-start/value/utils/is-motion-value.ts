/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionValue } from '../index.svelte';

export const isMotionValue = (value: unknown): value is MotionValue =>
	Boolean(value && (value as MotionValue).getVelocity);
