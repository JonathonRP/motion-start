/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { untrack } from 'svelte';
import { usePresenceContext, type PresenceContext } from '../../context/PresenceContext.svelte';

let counter = 0;
const incrementId = () => counter++;

export type SafeToRemove = () => void;
export type AlwaysPresent = [true, null];
export type Present = [true];
export type NotPresent = [false, SafeToRemove];

export function isPresent(context: () => PresenceContext | null) {
	const contextMemo = $derived.by(context);
	return () => contextMemo === null ? true : contextMemo.isPresent;
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
	return isPresent(() => usePresenceContext().current);
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
export const usePresence = (): (() => AlwaysPresent | Present | NotPresent) => {
	const contextRef = usePresenceContext();
	const context = $derived(contextRef.current);

	// Early return for no context - but check reactively
	const isContextNull = $derived(context === null);

	const id = incrementId();

	// Register with the presence context
	$effect(() => {
		const ctx = context;
		if (ctx?.register) {
			return untrack(() => ctx.register(id));
		}
	});

	// Return a function that reads current values reactively
	return () => {
		if (isContextNull) {
			return [true, null] satisfies AlwaysPresent;
		}

		const ctx = context;
		if (!ctx) {
			return [true, null] satisfies AlwaysPresent;
		}

		const { isPresent, onExitComplete } = ctx;
		const safeToRemove = () => onExitComplete?.(id);

		return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
	};
};
