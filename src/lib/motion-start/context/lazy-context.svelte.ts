/**
 * Lazy Context using Svelte 5 createContext
 * Manages lazy loading of motion features
 *
 * @module lazy-context
 */

import { createContext } from 'svelte';
import type { CreateVisualElement } from '../render/types.js';

/**
 * Lazy context properties
 * @public
 */
export interface LazyContextValue {
    /** Custom renderer for visual elements */
    renderer?: CreateVisualElement<any>;
    /** Whether to use strict mode (throw errors on missing features) */
    strict: boolean;
}

/**
 * Default lazy configuration
 */
const DEFAULT_LAZY: LazyContextValue = {
    strict: false,
};

/**
 * Lazy context - manages lazy loading of motion features
 *
 * @example
 * ```svelte
 * <script>
 *   import { lazyContext } from 'motion-start/context';
 *
 *   lazyContext.set({
 *     strict: true,
 *     renderer: customRenderer
 *   });
 * </script>
 * ```
 *
 * @public
 */
export const lazyContext = createContext<LazyContextValue>('lazy-context');

/**
 * Get the current lazy configuration
 *
 * @returns The lazy context value with defaults
 * @public
 */
export function useLazyContext(): LazyContextValue {
    return lazyContext.get() ?? DEFAULT_LAZY;
}
