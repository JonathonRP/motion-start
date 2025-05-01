/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { useContext } from '../../context/use';
import { PresenceContext } from '../../context/PresenceContext';
import { untrack } from 'svelte';

export type SafeToRemove = () => void;
export type AlwaysPresent = [true, null];
export type Present = [true];
export type NotPresent = [false, SafeToRemove];

export function isPresent(context: PresenceContext | null) {
	return () => (context === null ? true : context.isPresent);
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
export const useIsPresent = (): (() => boolean) => {
	const presenceContext = $derived(useContext(PresenceContext).current);
	return isPresent(presenceContext);
};

let counter = 0;
const incrementId = () => counter++;

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
export const usePresence = (subscribe: () => boolean = () => true): (() => AlwaysPresent | Present | NotPresent) => {
	const context = $derived(useContext(PresenceContext).current);

	if (context === null) {
		return () => [true, null] satisfies AlwaysPresent;
	}

	const { isPresent, onExitComplete, register } = $derived(context);

	const id = $derived.by(incrementId);
	$effect(() => {
		if (subscribe()) {
			return untrack(() => register(id));
		}
	});

	const safeToRemove = subscribe() && onExitComplete && onExitComplete(id);

	return () => (!isPresent && onExitComplete && safeToRemove ? [false, safeToRemove] : [true]);
};
