/**
 * Modern Motion Context using Svelte 5
 * Based on framer-motion@11.11.11
 *
 * @module motion-context
 */

import { getContext, setContext } from 'svelte';
import type { VisualElement } from '../render/types.js';

/**
 * Motion context properties
 * @public
 */
export interface MotionContextValue {
    visualElement?: VisualElement;
    initial?: false | string | string[];
    animate?: string | string[];
}

/**
 * Motion context key
 */
const MOTION_CONTEXT_KEY = Symbol('motion-context');

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
	 * Set motion context value
	 */
	set(value: MotionContextValue): void {
		setContext(MOTION_CONTEXT_KEY, value);
	},

	/**
	 * Get motion context value
	 */
	get(): MotionContextValue | undefined {
		return getContext<MotionContextValue>(MOTION_CONTEXT_KEY);
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
    return motionContext.get() ?? {};
}
