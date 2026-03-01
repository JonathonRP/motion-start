/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { useMotionConfigContext } from '../../context/MotionConfigContext.svelte';
import { useReducedMotion } from './use-reduced-motion';

export function useReducedMotionConfig() {
	const reducedMotionPreference = useReducedMotion();
	const { reducedMotion } = useMotionConfigContext().current;

	if (reducedMotion === 'never') {
		return false;
	} else if (reducedMotion === 'always') {
		return true;
	} else {
		return reducedMotionPreference();
	}
}
