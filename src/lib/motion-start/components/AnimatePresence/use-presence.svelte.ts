/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { derived, readable, toStore, type Readable } from 'svelte/store';
import { useContext } from '../../context/utils/context';
import { PresenceContext } from '../../context/PresenceContext';
import { useId } from '$lib/motion-start/utils/useId';

export type SafeToRemove = () => void;
export type AlwaysPresent = [true, null];
export type Present = [true];
export type NotPresent = [false, SafeToRemove];

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
export const useIsPresent = (): boolean => {
	const presenceContext = $derived(useContext(PresenceContext));
	return isPresent(presenceContext);
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
export const usePresence = (): Readable<AlwaysPresent | Present | NotPresent> => {
	const context = $derived(useContext(PresenceContext));

	if (context === null) {
		return readable([true, null]) satisfies Readable<AlwaysPresent>;
	}

	const { register } = $derived(context);

	const id = useId();
	$effect.pre(() => {
		if (context !== null) {
			register(id);
		}
	});

	return derived<Readable<PresenceContext | null>, Present | NotPresent>(
		toStore(() => context),
		($v) =>
			!$v?.isPresent && $v?.onExitComplete
				? ([false, () => $v.onExitComplete?.(id)] satisfies NotPresent)
				: ([true] satisfies Present)
	);
};
