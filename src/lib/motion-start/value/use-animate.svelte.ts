/**
 * useAnimate hook
 * Provides manual animation controls with component-scoped selectors
 * Based on Motion v11.11.11
 */

import { onMount } from 'svelte';
import { type AnimationOptions, type AnimationPlaybackControls, animate } from '../animation/animate.js';
import type { AnimationScope } from '../animation/types.js';
import type { TargetAndTransition } from '../types.js';
import { isBrowser } from '../utils/environment.js';

export type AnimateFunction = (
	selector: string | Element,
	values: TargetAndTransition,
	options?: AnimationOptions<any>
) => AnimationPlaybackControls;

/**
 * Provides manual animation controls with automatic cleanup
 *
 * Returns a tuple of [scope, animate]. The scope is a ref to attach to a container
 * element, and animate is a function to animate elements within that scope.
 *
 * Note: This hook requires DOM element animation support.
 * Current implementation uses type assertions as the base animate()
 * function is being enhanced to support DOM elements (Motion v11 feature).
 *
 * @example
 * ```svelte
 * <script>
 *   import { useAnimate } from 'motion-start';
 *
 *   const [scope, animate] = useAnimate();
 *
 *   function handleClick() {
 *     animate('.box', { x: 100 }, { duration: 0.5 });
 *     animate('.circle', { scale: 1.5 }, { delay: 0.2 });
 *   }
 * </script>
 *
 * <div bind:this={scope.current}>
 *   <button onclick={handleClick}>Animate</button>
 *   <div class="box">Box</div>
 *   <div class="circle">Circle</div>
 * </div>
 * ```
 */
export function useAnimate<T extends Element = HTMLElement>(): [AnimationScope<T>, AnimateFunction] {
	// In Svelte, component scripts run once per instance, so we can directly create the scope
	// Create a scope object with a reactive current property
	let _current = $state<T | null>(null) as T;

	const scope: AnimationScope<T> = {
		get current() {
			return _current;
		},
		set current(value: T) {
			_current = value;
		},
		animations: [],
	} as AnimationScope<T>;

	const animateScoped: AnimateFunction = (selector, values, options) => {
		if (!isBrowser || !scope.current) {
			return {
				stop: () => {},
				time: 0,
				speed: 1,
				duration: 0,
				then: (onResolve: any) => Promise.resolve().then(onResolve),
			};
		}

		let element: Element | null = null;

		if (typeof selector === 'string') {
			element = (scope.current as any).querySelector(selector);
		} else {
			element = selector;
		}

		if (!element) {
			console.warn(`useAnimate: No element found for selector "${selector}"`);
			return {
				stop: () => {},
				time: 0,
				speed: 1,
				duration: 0,
				then: (onResolve: any) => Promise.resolve().then(onResolve),
			};
		}

		// Type assertion needed: animate() will be enhanced to support DOM elements
		const controls = animate(element as any, values as any, options);
		scope.animations.push(controls);

		return controls;
	};

	onMount(() => {
		return () => {
			// Cleanup: stop all active animations
			scope.animations.forEach((ctrl) => ctrl.stop());
			scope.animations = [];
		};
	});

	return [scope, animateScoped];
}
