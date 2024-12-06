/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { useContext } from '../../context/utils/context.svelte';
import { MotionConfigContext } from '../../context/MotionConfigContext';
import { useReducedMotion } from './use-reduced-motion';
import { fromStore, get } from 'svelte/store';

export function useReducedMotionConfig(isCustom = false) {
	const reducedMotionPreference = useReducedMotion();
	const { reducedMotion } = fromStore(useContext(MotionConfigContext, isCustom)).current;

	if (reducedMotion === 'never') {
		return false;
	} else if (reducedMotion === 'always') {
		return true;
	} else {
		return reducedMotionPreference;
	}
}
