/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { ReorderContext as ReorderContextProps } from '../components/Reorder/types';

interface ReorderContext<T> extends ReorderContextProps<T> {}

const [getReorderContext, setReorderContext] = createContext<ReorderContext<any> | null>();

function useReorderContext() {
    try {
        return getReorderContext();
    } catch {
        return setReorderContext(null);
    }
}

export {
    useReorderContext,
    setReorderContext,
}