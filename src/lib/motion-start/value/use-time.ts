/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { useAnimationFrame } from '../utils/use-animation-frame.svelte.js';
import { useMotionValue } from './use-motion-value.svelte.js';

export function useTime() {
	const time = useMotionValue(0);
	useAnimationFrame((t) => time.set(t));
	return time;
}
