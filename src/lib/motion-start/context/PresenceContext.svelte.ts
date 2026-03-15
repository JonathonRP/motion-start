/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { VariantLabels } from '../motion/types';
import type { Attachment } from 'svelte/attachments';

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
	layoutDependency?: number;
	/** Bumped before DOM removal to trigger willUpdate() snapshot while exiting sibling still in DOM */
	snapshotTrigger?: number;
}

const [getPresenceContext, setPresenceContext] = createContext<PresenceContext | null>();

function usePresenceContext() {
	try {
		return getPresenceContext();
	} catch {
		return null;
	}
}

export { usePresenceContext, setPresenceContext };
