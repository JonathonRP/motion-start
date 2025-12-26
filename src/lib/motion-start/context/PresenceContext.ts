/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { VariantLabels } from '../motion/types.js';
import type { Writable } from 'svelte/store';

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
	presenceChildren?: Writable<{ key: any }>;
}

/**
 * Presence context created with Svelte 5's createContext
 * @internal
 */
const [getPresenceContext, setPresenceContext] = createContext<PresenceContext | null>();

/**
 * Presence context - provides animation presence state to descendants
 * @public
 */
export const PresenceContext = {
	/**
	 * Set presence context value and return it
	 */
	set(value: PresenceContext | null): PresenceContext | null {
		return setPresenceContext(value);
	},

	/**
	 * Get presence context value (returns null if not in context)
	 */
	get(): PresenceContext | null {
		try {
			return getPresenceContext();
		} catch {
			return null;
		}
	},
};
