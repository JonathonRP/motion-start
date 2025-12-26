/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { CreateVisualElement } from '../render/types.js';

export interface LazyContext {
	renderer?: CreateVisualElement<any>;
	strict: boolean;
}

const DEFAULT_LAZY: LazyContext = { strict: false };

/**
 * Lazy context created with Svelte 5's createContext
 * @internal
 */
const [getLazyContext, setLazyContext] = createContext<LazyContext>();

/**
 * Lazy context - provides lazy-loaded renderer
 * @public
 */
export const LazyContext = {
	/**
	 * Set lazy context value and return it
	 */
	set(value: LazyContext): LazyContext {
		return setLazyContext(value);
	},

	/**
	 * Get lazy context value (returns default if not in context)
	 */
	get(): LazyContext {
		try {
			return getLazyContext();
		} catch {
			return DEFAULT_LAZY;
		}
	},
};
