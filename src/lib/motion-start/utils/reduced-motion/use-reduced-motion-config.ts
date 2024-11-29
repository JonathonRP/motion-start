/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { tick } from 'svelte';
import { useContext } from '../../context/utils/context.svelte';
import { MotionConfigContext } from '../../context/MotionConfigContext';
import { useReducedMotion } from './use-reduced-motion';
import { get } from 'svelte/store';

export function useReducedMotionConfig(isCustom = false) {
	const reducedMotionPreference = useReducedMotion();
	const mcc = useContext(MotionConfigContext, isCustom);
	const { reducedMotion } = get(mcc);

	tick().then(() => {
		const { reducedMotion } = get(mcc);

		if (reducedMotion === 'never') {
			return false;
		} else if (reducedMotion === 'always') {
			return true;
		} else {
			return reducedMotionPreference;
		}
	});

	if (reducedMotion === 'never') {
		return false;
	} else if (reducedMotion === 'always') {
		return true;
	} else {
		return reducedMotionPreference;
	}
}
