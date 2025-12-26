/**
 * useSpring hook - Svelte 5 adaptation
 * Based on framer-motion@11.11.11
 *
 * Creates a MotionValue that animates to its target using spring physics
 */

import type { SpringOptions } from 'popmotion';
import { animate } from 'popmotion';
import { onMount } from 'svelte';
import { useMotionConfig } from '../context/motion-config-context.svelte.js';
import { type MotionValue, motionValue } from './index.js';
import { isMotionValue } from './utils/is-motion-value.js';

/**
 * Creates a `MotionValue` that, when `set`, will use a spring animation to animate to its new state.
 *
 * It can either work as a stand-alone `MotionValue` by initialising it with a value, or as a subscriber
 * to another `MotionValue`.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useSpring } from 'motion-start';
 *
 *   const x = useSpring(0, { stiffness: 300 });
 *   const y = useSpring(x, { damping: 10 });
 * </script>
 * ```
 *
 * @param source - `MotionValue` or number. If provided a `MotionValue`, when the input `MotionValue` changes, the created `MotionValue` will spring towards that value.
 * @param config - Configuration options for the spring.
 * @returns `MotionValue`
 *
 * @public
 */
export function useSpring<T>(source: MotionValue<T> | T, config: SpringOptions = {}): MotionValue<T> {
	const motionConfig = useMotionConfig();

	// In Svelte, component scripts run once, so we can directly create these
	const value = motionValue(isMotionValue(source) ? source.get() : source);
	let activeAnimation: { stop: () => void } | null = null;
	let latestValue = isMotionValue(source) ? source.get() : source;

	/**
	 * Start a spring animation to the target value
	 */
	function startAnimation(target: T) {
		// Stop any existing animation
		stopAnimation();

		// In static mode, set value immediately
		if (motionConfig.isStatic) {
			value.set(target);
			return;
		}

		// Sample the animation if it hasn't rendered a frame yet
		// This ensures we start from the correct value
		const currentValue = value.get();

		// Start new spring animation
		activeAnimation = animate({
			from: currentValue as number,
			to: target as number,
			velocity: value.getVelocity(),
			...config,
			onUpdate: (v: number) => value.set(v as T),
			onComplete: () => {
				activeAnimation = null;
			},
		});
	}

	/**
	 * Stop the currently active animation
	 */
	function stopAnimation() {
		if (activeAnimation) {
			activeAnimation.stop();
			activeAnimation = null;
		}
	}

	// Attach passive effect to value
	value.attach((newTarget, set) => {
		// Update latest value
		latestValue = newTarget;

		// If in static mode, set directly
		if (motionConfig.isStatic) {
			set(newTarget);
			return newTarget;
		}

		// Otherwise start animation to new target
		startAnimation(newTarget);
		return value.get();
	});

	// Subscribe to source MotionValue if provided
	if (isMotionValue(source)) {
		const unsubscribe = source.onChange((v) => {
			latestValue = v;
			value.set(v);
		});

		onMount(() => unsubscribe);
	}

	// Cleanup on unmount
	onMount(() => {
		return () => {
			stopAnimation();
		};
	});

	return value;
}
