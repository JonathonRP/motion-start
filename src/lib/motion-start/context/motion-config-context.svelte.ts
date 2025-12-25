/**
 * MotionConfig Context using Svelte 5 createContext
 * Provides global motion configuration
 *
 * @module motion-config-context
 */

import { createContext } from 'svelte';
import type { Transition } from '../types/index.js';

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
}

/**
 * Default motion configuration
 */
const DEFAULT_CONFIG: MotionConfigContextValue = {
    transformPagePoint: (point) => point,
    isStatic: false,
};

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
export const motionConfigContext = createContext<MotionConfigContextValue>('motion-config-context');

/**
 * Get the current motion configuration
 *
 * @returns The motion config with defaults
 * @public
 */
export function useMotionConfig(): MotionConfigContextValue {
    return motionConfigContext.get() ?? DEFAULT_CONFIG;
}
