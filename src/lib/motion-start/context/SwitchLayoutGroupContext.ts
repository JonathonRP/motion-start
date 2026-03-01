/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { IProjectionNode } from '../projection/node/types';
import type { Transition } from '../types';
import type { MutableRefObject } from '../utils/safe-react-types';
import { ref } from '../utils/ref.svelte';

export interface SwitchLayoutGroup {
	register?: <I>(member: IProjectionNode<I>) => void;
	deregister?: <I>(member: IProjectionNode<I>) => void;
}

export type SwitchLayoutGroupContext = SwitchLayoutGroup & InitialPromotionConfig;

export type InitialPromotionConfig = {
	/**
	 * The initial transition to use when the elements in this group mount (and automatically promoted).
	 * Subsequent updates should provide a transition in the promote method.
	 */
	transition?: Transition;
	/**
	 * If the follow tree should preserve its opacity when the lead is promoted on mount
	 */
	shouldPreserveFollowOpacity?: <I>(member: IProjectionNode<I>) => boolean;
};

/**
 * Internal, exported only for usage in Framer
 */
const [getSwitchLayoutGroupContext, setSwitchLayoutGroupContext] = createContext<MutableRefObject<SwitchLayoutGroupContext>>();

export function useSwitchLayoutGroupContext() {
	try {
		return getSwitchLayoutGroupContext();
	} catch {
		return ref({});
	}
}