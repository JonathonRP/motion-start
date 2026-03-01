/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { CreateVisualElement } from '../render/types';
import type { MutableRefObject } from '../utils/safe-react-types';
import { ref } from '../utils/ref.svelte';

export interface LazyContext {
	renderer?: CreateVisualElement<any>;
	strict: boolean;
}

const [getLazyContext, setLazyContext] = createContext<MutableRefObject<LazyContext>>();

function useLazyContext() {
	try {
		return getLazyContext();
	} catch {
		return ref({ strict: true });
	}
}

export { useLazyContext, setLazyContext };