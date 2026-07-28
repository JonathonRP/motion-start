/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { useMotionConfigContext } from '../../context/MotionConfigContext.svelte.js';
import { useReducedMotion } from './use-reduced-motion.js';

export function useReducedMotionConfig() {
	const reducedMotionPreference = useReducedMotion();
	const { reducedMotion } = useMotionConfigContext();

	if (reducedMotion === 'never') {
		return false;
	} else if (reducedMotion === 'always') {
		return true;
	} else {
		return reducedMotionPreference();
	}
}
