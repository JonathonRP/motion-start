/**
 * useTime hook for perpetual animations
 * Based on Motion v11.11.11
 *
 * Returns a motion value that updates once per frame with the duration,
 * in milliseconds, since it was first created.
 */

import { onMount } from 'svelte';
import { MotionValue } from './index.js';

/**
 * Create a motion value that tracks elapsed time
 *
 * @example
 * ```svelte
 * <script>
 * import { useTime, useTransform } from "motion-start";
 *
 * const time = useTime();
 * const rotate = useTransform(time, (latest) => latest / 10);
 * </script>
 *
 * <Motion.div style={{ rotate }} />
 * ```
 *
 * @returns A MotionValue tracking time in milliseconds
 */
export function useTime(): MotionValue<number> {
    const time = new MotionValue(0);
    let rafId: number | undefined;
    let startTime: number | undefined;

    const updateTime = (timestamp: number) => {
        if (startTime === undefined) {
            startTime = timestamp;
        }

        time.set(timestamp - startTime);
        rafId = requestAnimationFrame(updateTime);
    };

    onMount(() => {
        rafId = requestAnimationFrame(updateTime);

        return () => {
            if (rafId !== undefined) {
                cancelAnimationFrame(rafId);
            }
        };
    });

    return time;
}