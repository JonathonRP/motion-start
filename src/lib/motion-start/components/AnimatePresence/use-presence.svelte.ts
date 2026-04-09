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
	return () => (contextMemo === null ? true : contextMemo.isPresent);
}

/**
 * Similar to framer-motion's useIsPresent. Returns whether the component is
 * still present in the AnimatePresence tree, without exposing safeToRemove.
 */
export const useIsPresent = (): (() => boolean) => {
	return isPresent(() => usePresenceContext());
};

/**
 * Exposes the current presence state and, when exiting, a safeToRemove callback
 * that lets AnimatePresence know the component has finished its exit work.
 */
export const usePresence = (): (() => AlwaysPresent | Present | NotPresent) => {
	const context = usePresenceContext();
	const isContextNull = $derived(context === null);

	const id = incrementId();

	// Register once with the current presence context so this component can
	// participate in the parent's exit completion bookkeeping.
	$effect(() => {
		const ctx = context;
		if (ctx?.register) {
			return untrack(() => ctx.register(id));
		}
	});

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
