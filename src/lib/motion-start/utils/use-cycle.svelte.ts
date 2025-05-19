/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

// import { wrap } from './wrap';
import { untrack } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export type Cycle = (i?: number) => void;
export type CycleState<T> = [() => T, Cycle];

function* wrap<T>(params: T[]) {
	while (true) {
		yield* params;
	}
}

/**
 * Cycles through a series of visual properties. Can be used to toggle between or cycle through animations. It works similar to `useState` in React. It is provided an initial array of possible states, and returns an array of two arguments.
 *
 * An index value can be passed to the returned `cycle` function to cycle to a specific index.
 *
 * ```jsx
 * import * as React from "react"
 * import { motion, useCycle } from "framer-motion"
 *
 * export const MyComponent = () => {
 *   const [x, cycleX] = useCycle(0, 50, 100)
 *
 *   return (
 *     <motion.div
 *       animate={{ x: x }}
 *       onTap={() => cycleX()}
 *      />
 *    )
 * }
 * ```
 *
 * @param items - items to cycle through
 * @returns [currentState, cycleState]
 *
 * @public
 */
export function useCycle<T>(...items: T[]): CycleState<T> {
	let index = 0;
	const cyclicalItems = wrap(items);
	let item = $state(cyclicalItems.next().value as T);

	const cycle = (next?: number) => {
		index = typeof next !== 'number' ? items.indexOf(cyclicalItems.next().value ?? item) : next;
		item = items[index];
	};

	// The array will change on each call, but by putting items.length at
	// the front of this array, we guarantee the dependency comparison will match up
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return [() => item, cycle];
}
