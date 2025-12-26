/**
 * @deprecated Use lazy-context.svelte.ts instead
 * This file re-exports from the new Svelte 5 implementation for backwards compatibility
 *
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import {
	lazyContext,
	useLazyContext,
	type LazyContextValue as LazyContextValueType,
} from './lazy-context.svelte.js';

/**
 * Lazy context interface
 * @deprecated Use LazyContextValue from lazy-context.svelte.ts
 * @public
 */
export interface LazyContext extends LazyContextValueType {}

/**
 * @deprecated Legacy type alias for backwards compatibility
 * @public
 */
export type LazyContextProps = LazyContext;

/**
 * Lazy context - manages lazy loading of motion features
 * @deprecated Use lazyContext from lazy-context.svelte.ts
 * @public
 */
export const LazyContext = lazyContext;

/**
 * Context key for backwards compatibility
 * @public
 */
export const LAZY_CONTEXT_KEY = LazyContext;

/**
 * Hook to get lazy context
 * @public
 */
export { useLazyContext };
