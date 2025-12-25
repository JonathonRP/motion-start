/**
 * useAnimationFrame hook
 * Runs a callback on every animation frame with time and delta values
 * Based on Motion v11.11.11
 */

import { onMount } from 'svelte';
import { isBrowser } from '../utils/environment.js';

export interface AnimationFrameCallback {
    (time: number, delta: number): void;
}

/**
 * Runs a callback on every animation frame
 *
 * @param callback - Function called on each frame with (time, delta)
 *
 * @example
 * ```svelte
 * <script>
 *   import { useAnimationFrame } from 'motion-start';
 *
 *   useAnimationFrame((time, delta) => {
 *     console.log(`Frame at ${time}ms, delta: ${delta}ms`);
 *   });
 * </script>
 * ```
 */
export function useAnimationFrame(callback: AnimationFrameCallback): void {
    onMount(() => {
        if (!isBrowser || !window.requestAnimationFrame) return;

        let previousTime: number | undefined;
        let rafId: number;

        const frame = (currentTime: number) => {
            if (previousTime === undefined) {
                previousTime = currentTime;
            }

            const delta = currentTime - previousTime;
            callback(currentTime, delta);

            previousTime = currentTime;
            rafId = requestAnimationFrame(frame);
        };

        rafId = requestAnimationFrame(frame);

        return () => {
            if (rafId !== undefined) {
                cancelAnimationFrame(rafId);
            }
        };
    });
}
