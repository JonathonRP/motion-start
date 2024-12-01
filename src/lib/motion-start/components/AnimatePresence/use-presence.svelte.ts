/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { derived, fromStore, get, readable, toStore, type Readable, type Writable } from 'svelte/store';
import { useContext } from '../../context/utils/context.svelte';
import { PresenceContext } from '../../context/PresenceContext';

export type SafeToRemove = () => void;
export type AlwaysPresent = [true, null];
export type Present = [true];
export type NotPresent = [false, SafeToRemove];

let counter = 0;
const incrementId = () => counter++;

export function isPresent(context: PresenceContext) {
	return context === null ? true : context.isPresent;
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
	const presenceContext = useContext(PresenceContext, isCustom);
	return derived(presenceContext, ($v) => ($v === null ? true : $v.isPresent));
};

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
	const context = fromStore(useContext(PresenceContext, isCustom));
	const id = context.current === null ? undefined : incrementId();
	$effect(() => {
		if (context.current !== null) {
			context.current?.register(id!);
		}
	});

	if (context.current === null) {
		return readable([true, null]) satisfies Readable<AlwaysPresent>;
	}
	return derived<Readable<PresenceContext | null>, Present | NotPresent>(
		toStore(() => context.current),
		($v) =>
			!$v?.isPresent && $v?.onExitComplete
				? ([false, () => $v.onExitComplete?.(id!)] satisfies NotPresent)
				: ([true] satisfies Present)
	);
};
