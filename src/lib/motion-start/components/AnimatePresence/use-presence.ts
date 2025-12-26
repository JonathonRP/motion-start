/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { Readable, Writable } from 'svelte/store';
import type { PresenceContextProps } from "../../context/PresenceContext";

import { derived, get, readable } from 'svelte/store';
import { PresenceContext } from '../../context/PresenceContext.js';

import { getContext, onMount } from "svelte";

export type SafeToRemove = () => void;
export type AlwaysPresent = [true, null];
export type Present = [true];
export type NotPresent = [false, SafeToRemove];

let counter = 0;
const incrementId = () => counter++;

export function isPresent(context: PresenceContextProps) {
    return context === null ? true : context.isPresent
}

/**
 * Similar to `usePresence`, except `useIsPresent` simply returns whether or not the component is present.
 * There is no `safeToRemove` function.
 *
 * ```jsx
 * import { useIsPresent } from "framer-motion"
 *
 * export const Component = () => {
 *   const isPresent = useIsPresent()
 *
 *   useEffect(() => {
 *     !isPresent && console.log("I've been removed!")
 *   }, [isPresent])
 *
 *   return <div />
 * }
 * ```
 *
 * @public
 */
export const useIsPresent = (isCustom = false): Readable<boolean> => {
    let presenceContext = PresenceContext.get();
    return readable(presenceContext === null ? true : presenceContext.isPresent);
}

/**
 * When a component is the child of `AnimatePresence`, it can use `usePresence`
 * to access information about whether it's still present in the React tree.
 *
 * ```jsx
 * import { usePresence } from "framer-motion"
 *
 * const [isPresent, safeToRemove] = usePresence()
 *
 * 
 *  $: !isPresent && setTimeout(safeToRemove, 1000)
 * 
 *
 *   return <div />
 * }
 * ```
 *
 * If `isPresent` is `false`, it means that a component has been removed the tree, but
 * `AnimatePresence` won't really remove it until `safeToRemove` has been called.
 *
 * @public
 */
export const usePresence = (isCustom = false): Readable<AlwaysPresent | Present | NotPresent> => {

    const context = PresenceContext.get();
    const id = context === null ? undefined : incrementId();

    onMount(() => {
        if (context !== null && id !== undefined) {
            context.register(id);
        }
    })

    if (context === null) {
        return readable([true, null]) satisfies Readable<AlwaysPresent>;
    }

    return readable<Present | NotPresent>(
        (!context.isPresent && context.onExitComplete) ?
            [false, () => context.onExitComplete?.(id!)] satisfies NotPresent :
            [true] satisfies Present
    );
}