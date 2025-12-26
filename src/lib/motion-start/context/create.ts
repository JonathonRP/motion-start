/**
 * Context creation helper
 *
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import { Context } from './index.svelte.js';

export function createContext<T>(defaultValue: T) {
	return new Context<T>(defaultValue);
}
