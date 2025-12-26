/**
 * Modern Motion Context using Svelte 5 createContext
 * Based on framer-motion@11.11.11
 *
 * @module motion-context
 */

import { createContext } from 'svelte';
import type { VisualElement } from '../render/types.js';

/**
 * Motion context properties
 * @public
 */
export interface MotionContextValue {
	visualElement?: VisualElement;
	initial?: false | string | string[];
	animate?: string | string[];
	/** @deprecated Legacy property for backwards compatibility */
	forEach?: any;
}

/**
 * Motion context created with Svelte 5's createContext
 * Returns a tuple of [get, set] functions for type-safe context access
 * @internal
 */
const [getMotionContext, setMotionContext] = createContext<MotionContextValue>();

/**
 * Default motion context value
 */
const DEFAULT_MOTION_CONTEXT: MotionContextValue = {};

/**
 * Motion context - provides visual element and animation state to descendants
 *
 * @example
 * ```svelte
 * <script>
 *   import { motionContext } from 'motion-start/context';
 *
 *   motionContext.set({ visualElement, initial: 'hidden' });
 * </script>
 * ```
 *
 * @public
 */
export const motionContext = {
	/**
	 * Set motion context value and return it
	 */
	set(value: MotionContextValue): MotionContextValue {
		setMotionContext(value);
		return value;
	},

	/**
	 * Get motion context value (returns default empty object if not in context)
	 */
	get(): MotionContextValue {
		try {
			return getMotionContext();
		} catch {
			return DEFAULT_MOTION_CONTEXT;
		}
	},
};

/**
 * Get the current visual element from motion context
 *
 * @returns The visual element or undefined
 * @public
 */
export function useVisualElement(): VisualElement | undefined {
	const ctx = motionContext.get();
	return ctx?.visualElement;
}

/**
 * Get the full motion context value
 *
 * @returns The motion context value with default fallback
 * @public
 */
export function useMotionContext(): MotionContextValue {
	return motionContext.get();
}
