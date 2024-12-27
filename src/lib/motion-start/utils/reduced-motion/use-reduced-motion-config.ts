/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { useContext } from '../../context/utils/context';
import { MotionConfigContext } from '../../context/MotionConfigContext';
import { useReducedMotion } from './use-reduced-motion';

export function useReducedMotionConfig() {
	const reducedMotionPreference = useReducedMotion();
	const { reducedMotion } = $derived(useContext(MotionConfigContext));

	if (reducedMotion === 'never') {
		return false;
	} else if (reducedMotion === 'always') {
		return true;
	} else {
		return reducedMotionPreference;
	}
}
