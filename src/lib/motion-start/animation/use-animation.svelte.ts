/**
 * Animation Controls Hook
 * Creates animation controls for manual animation sequencing
 *
 * Based on framer-motion@11.11.11
 * @module use-animation
 */

import { animationControls } from './animation-controls.js';
import type { AnimationControls } from './types.js';

/**
 * Use animation controls
 *
 * Creates `AnimationControls`, which can be used to manually start, stop
 * and sequence animations on one or more components.
 *
 * The returned `AnimationControls` should be passed to the `animate` property
 * of the components you want to animate.
 *
 * These components can then be animated with the `start` method.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useAnimation } from 'motion-start/animation';
 *   import { Motion } from 'motion-start';
 *
 *   const controls = useAnimation();
 *
 *   function handleClick() {
 *     controls.start({
 *       x: 100,
 *       transition: { duration: 0.5 }
 *     });
 *   }
 * </script>
 *
 * <Motion.div animate={controls} />
 * <button onclick={handleClick}>Animate</button>
 * ```
 *
 * @param startStopNotifier - Optional callback for mount/unmount notifications
 * @returns Animation controller with `start`, `stop`, `set`, and `subscribe` methods
 * @public
 */
export function useAnimation(startStopNotifier?: () => () => void): AnimationControls {
	const controls = animationControls(startStopNotifier);

	$effect(() => {
		return controls.mount();
	});

	return controls;
}
