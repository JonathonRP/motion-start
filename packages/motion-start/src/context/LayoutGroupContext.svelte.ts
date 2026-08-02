/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { getContext, hasContext, setContext } from 'svelte';
import type { NodeGroup } from '../projection/node/group.js';

export interface LayoutGroupContext {
	id?: string;
	group?: NodeGroup;
	forceRender?: VoidFunction;
	key?: number;
}

// Context key
export const LAYOUT_GROUP_CONTEXT_KEY = Symbol('LayoutGroupContext');

/**
 * Reads the closest `LayoutGroup` context.
 *
 * `getContext`/`hasContext` are lifecycle APIs, so this must be called during
 * component initialisation. A missing provider is expected, since motion
 * components are routinely rendered outside a `LayoutGroup`, and is reported as
 * `null`. Any other failure, notably calling this outside initialisation, is
 * left to throw so the misuse is visible instead of silently degrading.
 */
function useLayoutGroupContext(): LayoutGroupContext | null {
	if (!hasContext(LAYOUT_GROUP_CONTEXT_KEY)) return null;
	return getContext<LayoutGroupContext | null>(LAYOUT_GROUP_CONTEXT_KEY) ?? null;
}

function setLayoutGroupContext(context: LayoutGroupContext): LayoutGroupContext {
	return setContext(LAYOUT_GROUP_CONTEXT_KEY, context);
}

export { useLayoutGroupContext, setLayoutGroupContext };
