/**
 * Reorder context
 * Based on Motion v11.11.11
 */

import type { ReorderContextValue } from './types.js';

export const REORDER_CONTEXT_KEY = Symbol('ReorderContext');

export function getReorderContext<T>(): ReorderContextValue<T> | undefined {
	return undefined;
}
