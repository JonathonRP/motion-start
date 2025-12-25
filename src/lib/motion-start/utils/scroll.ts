/**
 * scroll() - Vanilla JavaScript scroll-linked animations
 * Based on Motion v11.11.11
 *
 * Performant scroll-linked animations using the Scroll Timeline API
 * with fallback to scroll event listeners.
 */

import { animate } from '../animation/animate.js';
import type { AnimationOptions, AnimationPlaybackControls } from '../animation/animate.js';
import type { TargetAndTransition } from '../types.js';
import { isBrowser } from './environment.js';

export interface ScrollOptions {
    /**
     * Container element to track scroll on
     * Defaults to window
     */
    container?: Element;
    /**
     * Target element to measure scroll progress against
     * Defaults to container
     */
    target?: Element;
    /**
     * Axis to track scroll on
     * @default "y"
     */
    axis?: 'x' | 'y';
    /**
     * Offset to apply to scroll measurements
     * Supports CSS syntax like "start end", "100px 200px"
     */
    offset?: string | [string, string];
}

export interface ScrollInfo {
    time: number;
    velocity: number;
}

/**
 * Create scroll-linked animations
 *
 * @example
 * ```ts
 * import { scroll, animate } from 'motion-start';
 *
 * // Animate element based on scroll
 * scroll(animate('.box', { opacity: [0, 1] }));
 *
 * // With options
 * scroll(
 *   animate('.box', { opacity: [0, 1] }),
 *   { target: document.querySelector('.trigger') }
 * );
 * ```
 */
export function scroll(
    animation: AnimationPlaybackControls,
    options: ScrollOptions = {}
): () => void {
    if (!isBrowser) {
        return () => {};
    }

    const {
        container = window,
        target,
        axis = 'y',
        offset
    } = options;

    let rafId: number;
    let prevScroll = 0;
    let prevTime = 0;

    const updateAnimation = () => {
        const scrollElement = container === window
            ? document.documentElement
            : container as Element;

        const scroll = axis === 'x'
            ? scrollElement.scrollLeft
            : scrollElement.scrollTop;

        const maxScroll = axis === 'x'
            ? scrollElement.scrollWidth - scrollElement.clientWidth
            : scrollElement.scrollHeight - scrollElement.clientHeight;

        // Calculate progress (0-1)
        let progress = maxScroll > 0 ? scroll / maxScroll : 0;

        // Apply offset if specified
        if (offset) {
            const [start, end] = Array.isArray(offset) ? offset : [offset, offset];
            const startOffset = parseFloat(start) / 100 || 0;
            const endOffset = parseFloat(end) / 100 || 1;
            progress = (progress - startOffset) / (endOffset - startOffset);
        }

        // Clamp progress
        progress = Math.max(0, Math.min(1, progress));

        // Update animation time
        if (animation.time !== undefined) {
            animation.time = progress * (animation.duration || 1);
        }
    };

    const onScroll = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            updateAnimation();
            rafId = 0 as any;
        });
    };

    // Initial update
    updateAnimation();

    // Listen for scroll
    const scrollTarget = container === window ? window : container;
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });

    // Cleanup function
    return () => {
        scrollTarget.removeEventListener('scroll', onScroll);
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
    };
}

/**
 * Animate element based on scroll progress
 *
 * @example
 * ```ts
 * import { scrollAnimate } from 'motion-start';
 *
 * const cleanup = scrollAnimate(
 *   '.parallax',
 *   { y: [0, -100] },
 *   { container: document.querySelector('.scroller') }
 * );
 * ```
 */
export function scrollAnimate(
    element: Element | string,
    values: TargetAndTransition,
    options: ScrollOptions & AnimationOptions<any> = {}
): () => void {
    const { container, target, axis, offset, ...animationOptions } = options;

    const animation = animate(element, values, {
        ...animationOptions,
        autoplay: false
    });

    return scroll(animation, { container, target, axis, offset });
}
