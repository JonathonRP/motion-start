/**
 * MotionConfig Context using Svelte 5
 * Provides global motion configuration
 *
 * @module motion-config-context
 */

import { createContext } from 'svelte';
import type { Transition } from '../types.js';

/**
 * Transform a point from page coordinates
 */
export type TransformPoint2D = (point: { x: number; y: number }) => { x: number; y: number };

/**
 * Motion configuration context value
 * @public
 */
export interface MotionConfigContextValue {
    /**
     * Transform page point - useful for drag constraints in transformed containers
     */
    transformPagePoint?: TransformPoint2D;
    /**
     * If true, motion components will not animate
     */
    isStatic?: boolean;
    /**
     * Default transition for all motion components
     */
    transition?: Transition;
    /**
     * Nonce for inline styles (CSP compliance)
     */
    nonce?: string;
}

/**
 * Default motion configuration
 */
const DEFAULT_CONFIG: MotionConfigContextValue = {
    transformPagePoint: (point) => point,
    isStatic: false,
};

/**
 * Motion config context created with Svelte 5's createContext
 * Returns a tuple of [get, set] functions for type-safe context access
 * @internal
 */
const [getMotionConfigContext, setMotionConfigContext] = createContext<MotionConfigContextValue>();

/**
 * Motion config context - provides global configuration
 *
 * @example
 * ```svelte
 * <script>
 *   import { motionConfigContext } from 'motion-start/context';
 *
 *   motionConfigContext.set({
 *     isStatic: true,
 *     transition: { duration: 0.3 }
 *   });
 * </script>
 * ```
 *
 * @public
 */
export const motionConfigContext = {
	/**
	 * Set motion config context value and return it
	 */
	set(value: MotionConfigContextValue): MotionConfigContextValue {
		setMotionConfigContext(value);
		return value;
	},

	/**
	 * Get motion config context value (returns default if not in context)
	 */
	get(): MotionConfigContextValue {
		try {
			return getMotionConfigContext();
		} catch {
			return DEFAULT_CONFIG;
		}
	},
};

/**
 * Get the current motion configuration
 *
 * @returns The motion config with defaults
 * @public
 */
export function useMotionConfig(): MotionConfigContextValue {
    return motionConfigContext.get();
}
