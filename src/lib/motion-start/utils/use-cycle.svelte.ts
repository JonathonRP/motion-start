/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

// import { wrap } from './wrap';
export type Cycle = (i?: number) => void;
export type CycleState<T> = [() => T, Cycle];

function wrap<T>(params: T[]) {
	let i = 0;
	return {
		set(n: number) {
			i = n;
		},
		next() {
			return this[Symbol.iterator]().next();
		},
		*[Symbol.iterator]() {
			while (true) {
				yield params[i++ % params.length];
			}
		},
	};
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
	const carousel = wrap(items);
	const nextItem = () => carousel.next().value;
	let item = $derived.by(nextItem);

	const cycle = (next?: number) => {
		next && carousel.set(next);
		item = nextItem();
	};

	// The array will change on each call, but by putting items.length at
	// the front of this array, we guarantee the dependency comparison will match up
	return [() => item, cycle];
}
