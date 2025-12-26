/**
 * useMotionValueEvent hook
 * Manages motion value event listeners with automatic cleanup
 * Based on Motion v11.11.11
 */

import { onMount } from 'svelte';
import type { MotionValue } from './index.js';

export type MotionValueEventType = 'change' | 'animationStart' | 'animationComplete' | 'animationCancel';

export type MotionValueEventHandler<V = any> = (value: V) => void;

/**
 * Subscribe to motion value events with automatic cleanup
 *
 * @param value - The motion value to subscribe to
 * @param event - Event type: "change", "animationStart", "animationComplete", "animationCancel"
 * @param callback - Function to call when event fires
 *
 * @example
 * ```svelte
 * <script>
 *   import { useMotionValue, useMotionValueEvent } from 'motion-start';
 *
 *   const x = useMotionValue(0);
 *
 *   useMotionValueEvent(x, 'change', (latest) => {
 *     console.log('x changed to:', latest);
 *   });
 *
 *   useMotionValueEvent(x, 'animationComplete', () => {
 *     console.log('Animation finished!');
 *   });
 * </script>
 * ```
 */
export function useMotionValueEvent<V = any>(
	value: MotionValue<V>,
	event: MotionValueEventType,
	callback: MotionValueEventHandler<V>
): void {
	onMount(() => {
		let unsubscribe: (() => void) | undefined;

		switch (event) {
			case 'change':
				unsubscribe = value.onChange(callback);
				break;
			case 'animationStart':
				// MotionValue doesn't have onAnimationStart in current implementation
				// Use onChange with a check for animation state instead
				if ('onAnimationStart' in value && typeof (value as any).onAnimationStart === 'function') {
					unsubscribe = (value as any).onAnimationStart(callback);
				} else {
					console.warn('animationStart event is not yet supported on this MotionValue');
				}
				break;
			case 'animationComplete':
				// MotionValue doesn't have onAnimationComplete in current implementation
				// Use onChange with a check for animation state instead
				if ('onAnimationComplete' in value && typeof (value as any).onAnimationComplete === 'function') {
					unsubscribe = (value as any).onAnimationComplete(callback);
				} else {
					console.warn('animationComplete event is not yet supported on this MotionValue');
				}
				break;
			case 'animationCancel':
				// MotionValue doesn't have onAnimationCancel yet
				// This is a placeholder for future compatibility
				console.warn('animationCancel event is not yet supported');
				break;
		}

		return () => {
			unsubscribe?.();
		};
	});
}
