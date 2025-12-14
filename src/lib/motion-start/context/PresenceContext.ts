/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { VariantLabels } from '../motion/types';
import type { MutableRefObject } from '../utils/safe-react-types';

/**
 * @public
 */
export interface PresenceContext {
	id: number | string;
	isPresent: boolean;
	register: (id: string | number) => () => void;
	onExitComplete?: (id: string | number) => void;
	initial?: false | VariantLabels;
	custom?: any;
}

/**
 * @public
 */
const [getPresenceContext, setPresenceContext] = createContext<MutableRefObject<PresenceContext | null>>();

function usePresenceContext() {
	try {
		return getPresenceContext();
	} catch {
		return setPresenceContext({ get current() { return null; } });
	}
}

export {
	usePresenceContext,
	setPresenceContext,
}