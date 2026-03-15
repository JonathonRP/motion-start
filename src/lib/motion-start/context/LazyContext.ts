/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { CreateVisualElement } from '../render/types';

export interface LazyContext {
	renderer?: CreateVisualElement<any>;
	strict: boolean;
}

const defaultLazyContext: LazyContext = { strict: false };

const [getLazyContext, setLazyContext] = createContext<LazyContext>();

function useLazyContext() {
	try {
		return getLazyContext();
	} catch {
		return defaultLazyContext;
	}
}

export { useLazyContext, setLazyContext };
