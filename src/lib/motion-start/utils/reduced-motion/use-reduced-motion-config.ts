/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { useMotionConfig } from '../../context/MotionConfigContext.svelte';
import { useReducedMotion } from './use-reduced-motion';

export function useReducedMotionConfig() {
	const reducedMotionPreference = useReducedMotion();
	const { reducedMotion } = useMotionConfig();

	if (reducedMotion === 'never') {
		return false;
	} else if (reducedMotion === 'always') {
		return true;
	} else {
		return reducedMotionPreference();
	}
}
