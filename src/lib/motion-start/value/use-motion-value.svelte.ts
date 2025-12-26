/**
 * useMotionValue hook - Svelte 5 adaptation
 * Based on framer-motion@11.11.11
 */

import { onMount } from 'svelte';
import { motionValue, type MotionValue } from './index.js';
import { useMotionConfig } from '../context/motion-config-context.svelte.js';

/**
 * Creates a `MotionValue` to track the state and velocity of a value.
 *
 * Usually, these are created automatically. For advanced use-cases, like use with `useTransform`,
 * you can create `MotionValue`s externally and pass them into the animated component via the `style` prop.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useMotionValue } from 'motion-start';
 *
 *   const scale = useMotionValue(1);
 * </script>
 *
 * <motion.div style={{ scale }} />
 * ```
 *
 * @param initial - The initial state.
 * @returns A MotionValue
 *
 * @public
 */
export function useMotionValue<T>(initial: T): MotionValue<T> {
    // In Svelte, component scripts run once per instance, so we can directly create the value
    const value = motionValue(initial);

    /**
     * If this motion value is being used in static mode, like on
     * the Framer canvas, force components to rerender when the motion
     * value is updated.
     */
    const config = useMotionConfig();

    if (config.isStatic) {
        // In Svelte, we use $state to trigger reactivity
        let latest = $state(initial);

        onMount(() => {
            return value.onChange((v) => {
                latest = v;
            });
        });
    }

    return value;
}
