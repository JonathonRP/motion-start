/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { ReorderContext as ReorderContextProps } from '../components/Reorder/types';
import type { MutableRefObject } from '../utils/safe-react-types';
import { ref } from '../utils/ref.svelte';

interface ReorderContext<T> extends ReorderContextProps<T> {}

const [getReorderContext, setReorderContext] = createContext<MutableRefObject<ReorderContext<any>>>();

function useReorderContext() {
	try {
		return getReorderContext();
	} catch {
		return ref(null);
	}
}

export { useReorderContext, setReorderContext };
