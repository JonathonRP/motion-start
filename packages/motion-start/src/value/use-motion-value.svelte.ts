/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { motionValue, type MotionValue } from './index.js';

/**
 * Creates a `MotionValue` to track the state and velocity of a value.
 *
 * Usually, these are created automatically. For advanced use-cases, like use with `useTransform`, you can create `MotionValue`s externally and pass them into the animated component via the `style` prop.
 *
 * ```jsx
 * export const MyComponent = () => {
 *   const scale = useMotionValue(1)
 *
 *   return <motion.div style={{ scale }} />
 * }
 * ```
 *
 * @param initial - The initial state.
 *
 * @public
 */
export function useMotionValue<T>(initial: T): MotionValue<T> {
	return motionValue(initial);
}
