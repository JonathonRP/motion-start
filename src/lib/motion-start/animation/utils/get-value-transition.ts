/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Transition } from '../../types';

export function getValueTransition(transition: Transition, key: string) {
	return transition
		? transition[key as keyof typeof transition] || (transition as any)['default'] || transition
		: undefined;
}
