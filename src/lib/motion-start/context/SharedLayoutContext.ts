/**
 * @deprecated Use shared-layout-context.svelte.ts instead
 * This file re-exports from the new Svelte 5 implementation for backwards compatibility
 *
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import { writable, type Writable } from 'svelte/store';
import type { SharedLayoutSyncMethods, SyncLayoutBatcher } from '../components/AnimateSharedLayout/types.js';
import { createBatcher } from '../components/AnimateSharedLayout/utils/batcher.js';
import {
	sharedLayoutContext,
	isSharedLayout as isSharedLayoutFn,
	useSharedLayout,
	type SharedLayoutContextValue,
} from './shared-layout-context.svelte.js';
import { getDomContext } from './DOMcontext.js';

/**
 * @deprecated Use sharedLayoutContext from shared-layout-context.svelte.ts
 * @param custom - Custom context identifier
 * @returns Writable store with shared layout batcher or sync methods
 */
function SharedLayoutContext(custom?: any): Writable<SyncLayoutBatcher> | Writable<SharedLayoutSyncMethods> {
	return (getDomContext('SharedLayout', custom) as any satisfies SharedLayoutSyncMethods) || writable(createBatcher());
}

/**
 * @deprecated Legacy Framer tree layout context
 * @internal
 */
const FramerTreeLayoutContext = (isCustom?: any) => writable(createBatcher());

/**
 * Check if context value is SharedLayoutSyncMethods
 * @public
 */
const isSharedLayout = isSharedLayoutFn;

export { FramerTreeLayoutContext, SharedLayoutContext, isSharedLayout, useSharedLayout };
export type { SharedLayoutContextValue };
