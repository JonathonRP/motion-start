/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { MutableRefObject } from '../utils/safe-react-types';
import { ref } from '../utils/ref.svelte';

const [getDeprecatedLayoutGroupContext, setDeprecatedLayoutGroupContext] = createContext<MutableRefObject<string>>();

function useDeprecatedLayoutGroupContext() {
    try {
        return getDeprecatedLayoutGroupContext();
    } catch {
        return ref(null);
    }
}

export { useDeprecatedLayoutGroupContext, setDeprecatedLayoutGroupContext };