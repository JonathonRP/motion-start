/**
 * @deprecated Use layout-group-context.svelte.ts instead
 * This file re-exports from the new Svelte 5 implementation for backwards compatibility
 *
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import { layoutGroupContext, useLayoutGroup } from './layout-group-context.svelte.js';

/**
 * Layout group context - provides layout group ID for shared layout animations
 * @deprecated Use layoutGroupContext from layout-group-context.svelte.ts
 * @public
 */
export const LayoutGroupContext = layoutGroupContext;

/**
 * Context key for backwards compatibility
 * @public
 */
export const LAYOUT_GROUP_CONTEXT_KEY = LayoutGroupContext;

/**
 * Hook to get layout group ID
 * @public
 */
export { useLayoutGroup };
