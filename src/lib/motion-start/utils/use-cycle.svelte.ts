/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

type Cycle = (i?: number) => void;
type CycleState<T> = {
    readonly current: T;
    cycle: Cycle;
};

/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Cycles through a series of visual properties. Can be used to toggle between or cycle through animations. It works similar to `useState` in React. It is provided an initial array of possible states, and returns an object with the current state and a cycle function.
 *
 * @library
 *
 * ```svelte
 * <script>
 * import { useCycle } from "motion-start"
 *
 * const state = useCycle(0, 50, 100)
 * </script>
 *
 * <Motion.div
 *   animate={{ x: state.current }}
 *   ontap={() => state.cycle()}
 * />
 * ```
 *
 * @motion
 *
 * An index value can be passed to the `cycle` function to cycle to a specific index.
 *
 * ```svelte
 * <script>
 * import { useCycle } from "motion-start"
 *
 * const state = useCycle(0, 50, 100)
 * </script>
 *
 * <Motion.div
 *   animate={{ x: state.current }}
 *   ontap={() => state.cycle(0)}
 * />
 * ```
 *
 * @param items - items to cycle through
 * @returns {CycleState} Object with current state and cycle function
 *
 * @public
 */
import { wrap } from "popmotion";

export const useCycle = <T>(...items: T[]): CycleState<T> => {
    let index = 0;
    let current = $state(items[index]);

    const cycle = (i?: number) => {
        index = typeof i !== "number"
            ? wrap(0, items.length, index + 1)
            : i;
        current = items[index];
    };

    return {
        get current() {
            return current;
        },
        cycle
    };
};