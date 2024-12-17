/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionValue } from '../index.svelte';

export interface WillChange extends MotionValue {
	add(name: string): void;
}
