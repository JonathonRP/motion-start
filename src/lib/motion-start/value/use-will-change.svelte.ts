/**
 * useWillChange hook for performance optimization
 * Based on Motion v11.11.11
 *
 * Automatically manages the will-change CSS property for better performance
 */

import { onMount } from 'svelte';
import { MotionValue } from './index.js';

export type WillChangeProperty =
    | 'auto'
    | 'transform'
    | 'opacity'
    | 'scroll-position'
    | 'contents'
    | 'background-color'
    | 'clip-path'
    | 'filter';

/**
 * Create a motion value that manages will-change CSS property
 *
 * @example
 * ```svelte
 * <script>
 * import { Motion, useWillChange } from "motion-start";
 *
 * const willChange = useWillChange();
 * </script>
 *
 * <Motion.div style={{ willChange }} animate={{ x: 100 }} />
 * ```
 *
 * @param properties - Properties to optimize with will-change
 * @returns A MotionValue managing will-change
 */
export function useWillChange(
    properties?: WillChangeProperty[]
): MotionValue<string> {
    const willChangeValue = new MotionValue('auto');

    if (properties && properties.length > 0) {
        const value = properties.join(', ');
        willChangeValue.set(value);
    }

    // Automatically add transform by default for motion components
    onMount(() => {
        if (!properties || properties.length === 0) {
            willChangeValue.set('transform');
        }

        // Clean up will-change after animations complete (best practice)
        return () => {
            willChangeValue.set('auto');
        };
    });

    return willChangeValue;
}

/**
 * Add properties to will-change dynamically
 *
 * @param willChange - The will-change MotionValue
 * @param properties - Properties to add
 */
export function addWillChange(
    willChange: MotionValue<string>,
    ...properties: WillChangeProperty[]
): void {
    const current = willChange.get();
    const currentProps = current === 'auto' ? [] : current.split(', ');
    const newProps = [...new Set([...currentProps, ...properties])];
    willChange.set(newProps.join(', '));
}

/**
 * Remove properties from will-change
 *
 * @param willChange - The will-change MotionValue
 * @param properties - Properties to remove
 */
export function removeWillChange(
    willChange: MotionValue<string>,
    ...properties: WillChangeProperty[]
): void {
    const current = willChange.get();
    if (current === 'auto') return;

    const currentProps = current.split(', ');
    const newProps = currentProps.filter(p => !properties.includes(p as WillChangeProperty));
    willChange.set(newProps.length > 0 ? newProps.join(', ') : 'auto');
}