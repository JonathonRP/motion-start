/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Readable } from 'svelte/store';
import type { PresenceContextProps } from "../../context/PresenceContext";

import { derived, get, readable } from 'svelte/store';
import { PresenceContext } from '../../context/PresenceContext.js';

import { getContext, onMount } from "svelte";

export declare type SafeToRemove = () => void;
declare type AlwaysPresent = [true, null];
declare type Present = [true];
declare type NotPresent = [false, SafeToRemove];

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
export const useIsPresent = (isCustom=false): Readable<boolean> => {
    let presenceContext = getContext(PresenceContext) || PresenceContext(isCustom);
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
export const usePresence = (isCustom=false): Readable<AlwaysPresent | Present | NotPresent> => {

    const context = getContext(PresenceContext)||PresenceContext(isCustom);
    const id = get(context) === null ? undefined : incrementId();
    onMount(()=>{
        if (get(context)!==null){
            get(context).register(id);
        }
    })

    if (get(context) === null){
        return readable([true,null]);
    }
    return derived(context,$v=>
        (!$v.isPresent && $v.onExitComplete) ? 
            [false, ()=>$v.onExitComplete?.(id)] :
            [true]
    )
}