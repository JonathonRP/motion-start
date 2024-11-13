/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { getContext, onMount } from 'svelte';
import { motionValue, type MotionValue } from '.';
import { MotionConfigContext } from '../context/MotionConfigContext';
import { get, type Writable } from 'svelte/store';

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
export function useMotionValue<T>(initial: T, isCustom = false): MotionValue<T> {
	const value = motionValue(initial);

	/**
	 * If this motion value is being used in static mode, like on
	 * the Framer canvas, force components to rerender when the motion
	 * value is updated.
	 */
	const { isStatic } = get(
		getContext<Writable<MotionConfigContext>>(MotionConfigContext) || MotionConfigContext(isCustom)
	);

	onMount(() => {
		if (isStatic) {
			value.on('change', (value) => (initial = value));
		}
	});

	return value;
}
