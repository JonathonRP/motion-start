/**
 * Context usage helper
 *
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import type { Context } from './index.svelte.js';

export function useContext<T>(context: Context<T>) {
	// biome-ignore lint/complexity/useLiteralKeys: accessing private methods
	return context['exists']() ? context['get']() : context['create']();
}
