/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Readable, Writable } from 'svelte/store';
import type { PresenceContextProps } from "../../context/PresenceContext";

import { derived, get, readable } from 'svelte/store';
import { PresenceContext } from '../../context/PresenceContext.js';

import { getContext, onDestroy, untrack } from "svelte";

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
    let presenceContext = getContext<Writable<PresenceContextProps>>(PresenceContext) || PresenceContext(isCustom);
    return derived(presenceContext, $v => $v === null ? true : $v.isPresent)
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

    const context = getContext<Writable<PresenceContextProps>>(PresenceContext) || PresenceContext(isCustom);

    // PresenceChild sets context via $effect (after children mount), so the store
    // is null during child initialization. Subscribe to register as soon as the real
    // context arrives instead of doing a one-shot get() that always sees null.
    //
    // untrack() is critical: without it, calling context.subscribe() inside
    // $derived(usePresence(...)) in Exit.svelte would make the $derived track the
    // context store, re-running usePresence() on every context change, creating a
    // new subscription + new store on each run → effect_update_depth_exceeded.
    let id: number | undefined;
    const unsubRegister = untrack(() =>
        context.subscribe(($v) => {
            if ($v !== null && id === undefined) {
                id = incrementId();
                $v.register(id);
            }
        })
    );
    onDestroy(unsubRegister);

    return derived<typeof context, AlwaysPresent | Present | NotPresent>(context, $v => {
        if ($v === null) return [true, null] satisfies AlwaysPresent;
        return (!$v.isPresent && $v.onExitComplete) ?
            [false, () => $v.onExitComplete?.(id!)] satisfies NotPresent :
            [true] satisfies Present;
    });
}