/**
 * useAnimate hook
 * Provides manual animation controls with component-scoped selectors
 * Based on Motion v11.11.11
 */

import { onMount } from 'svelte';
import type { TargetAndTransition, AnimationOptions } from '../types/index.js';
import { animate } from '../animation/animate.js';
import type { AnimationPlaybackControls } from '../animation/types.js';
import { isBrowser } from '../utils/environment.js';

export interface AnimateFunction {
    (
        selector: string | Element,
        values: TargetAndTransition,
        options?: AnimationOptions
    ): AnimationPlaybackControls;
}

export interface UseAnimateReturn {
    /**
     * Reference to the component scope element
     */
    readonly scope: HTMLElement | null;
    /**
     * Animate function with component-scoped selectors
     */
    readonly animate: AnimateFunction;
}

/**
 * Provides manual animation controls with automatic cleanup
 *
 * Returns a scope ref and animate function. Elements can be selected
 * within the scope using CSS selectors.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useAnimate } from 'motion-start';
 *
 *   const { scope, animate } = useAnimate();
 *
 *   function handleClick() {
 *     animate('.box', { x: 100 }, { duration: 0.5 });
 *     animate('.circle', { scale: 1.5 }, { delay: 0.2 });
 *   }
 * </script>
 *
 * <div bind:this={scope}>
 *   <button onclick={handleClick}>Animate</button>
 *   <div class="box">Box</div>
 *   <div class="circle">Circle</div>
 * </div>
 * ```
 */
export function useAnimate(): UseAnimateReturn {
    let scope = $state<HTMLElement | null>(null);
    let activeAnimations: AnimationPlaybackControls[] = [];

    const animateScoped: AnimateFunction = (selector, values, options) => {
        if (!isBrowser || !scope) {
            return {
                stop: () => {},
                time: 0,
                speed: 1,
                duration: 0,
                then: (onResolve: any) => Promise.resolve().then(onResolve)
            };
        }

        let element: Element | null = null;

        if (typeof selector === 'string') {
            element = scope.querySelector(selector);
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
                then: (onResolve: any) => Promise.resolve().then(onResolve)
            };
        }

        const controls = animate(element as Element, values, options);
        activeAnimations.push(controls);

        return controls;
    };

    onMount(() => {
        return () => {
            // Cleanup: stop all active animations
            activeAnimations.forEach(ctrl => ctrl.stop());
            activeAnimations = [];
        };
    });

    return {
        get scope() {
            return scope;
        },
        get animate() {
            return animateScoped;
        }
    };
}
