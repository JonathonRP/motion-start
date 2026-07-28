/**
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';

const [getDeprecatedLayoutGroupContext, setDeprecatedLayoutGroupContext] = createContext<string | null>();

function useDeprecatedLayoutGroupContext() {
    try {
        return getDeprecatedLayoutGroupContext();
    } catch {
        return null;
    }
}

export { useDeprecatedLayoutGroupContext, setDeprecatedLayoutGroupContext };
