/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { NodeGroup } from '../projection/node/group.js';

export interface LayoutGroupContext {
	id?: string;
	group?: NodeGroup;
	forceRender?: VoidFunction;
}

const DEFAULT_LAYOUT_GROUP: LayoutGroupContext = {};

/**
 * Layout group context created with Svelte 5's createContext
 * @internal
 */
const [getLayoutGroupContext, setLayoutGroupContext] = createContext<LayoutGroupContext>();

/**
 * Layout group context - provides layout group coordination
 * @public
 */
export const LayoutGroupContext = {
	/**
	 * Set layout group context value and return it
	 */
	set(value: LayoutGroupContext): LayoutGroupContext {
		return setLayoutGroupContext(value);
	},

	/**
	 * Get layout group context value (returns default if not in context)
	 */
	get(): LayoutGroupContext {
		try {
			return getLayoutGroupContext();
		} catch {
			return DEFAULT_LAYOUT_GROUP;
		}
	},
};
