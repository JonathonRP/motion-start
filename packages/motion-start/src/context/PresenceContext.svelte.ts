/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { VariantLabels } from '../motion/types.js';
import type { ReactiveInvalidation } from '../utils/reactive-invalidation.js';

/**
 * @public
 */
export interface PresenceContext {
	id: number | string;
	isPresent: boolean;
	register: (id: string | number) => () => void;
	onExitComplete?: (id: string | number) => void;
	measurePop?: Attachment;
	initial?: false | VariantLabels;
	custom?: any;
	presenceLayoutInvalidation?: ReactiveInvalidation;
}

const [getPresenceContext, setPresenceContext] = createContext<PresenceContext | null>();

function usePresenceContext() {
	try {
		return getPresenceContext();
	} catch {
		return null;
	}
}

export { setPresenceContext, usePresenceContext };
