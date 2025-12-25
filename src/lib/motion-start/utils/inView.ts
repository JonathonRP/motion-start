/**
 * inView() - Vanilla JavaScript viewport detection
 * Based on Motion v11.11.11
 *
 * Built on IntersectionObserver for performant viewport detection.
 */

import { animate } from '../animation/animate.js';
import type { AnimationOptions, AnimationPlaybackControls } from '../animation/animate.js';
import type { TargetAndTransition } from '../types/index.js';
import { hasIntersectionObserver, isBrowser } from '../utils/environment.js';

export interface InViewOptions {
    /**
     * Root element for intersection detection
     * Defaults to viewport
     */
    root?: Element;
    /**
     * Margin around root for detection
     * Supports CSS margin syntax (e.g., "0px 0px -200px 0px")
     */
    margin?: string;
    /**
     * Threshold for intersection (0-1)
     * Can be a single number or array of numbers
     */
    amount?: 'some' | 'all' | number | number[];
}

export interface InViewCallback {
    (entry: IntersectionObserverEntry): void;
}

/**
 * Detect when an element enters the viewport
 *
 * @example
 * ```ts
 * import { inView } from 'motion-start';
 *
 * // Simple callback
 * const cleanup = inView('.box', (info) => {
 *   console.log('Element entered viewport!', info);
 * });
 *
 * // Trigger animation on enter
 * inView('.box', () => {
 *   animate('.box', { opacity: 1 });
 * });
 *
 * // With options
 * inView('.box',
 *   (info) => console.log(info),
 *   { margin: '-100px', amount: 0.5 }
 * );
 * ```
 */
export function inView(
    element: Element | string,
    callback: InViewCallback,
    options: InViewOptions = {}
): () => void {
    if (!isBrowser || !hasIntersectionObserver) {
        return () => {};
    }

    const el = typeof element === 'string'
        ? document.querySelector(element)
        : element;

    if (!el) {
        console.warn(`inView: Element not found: ${element}`);
        return () => {};
    }

    const { root, margin = '0px', amount = 'some' } = options;

    // Convert amount to threshold
    let threshold: number | number[];
    if (amount === 'some') {
        threshold = 0.001; // Any intersection
    } else if (amount === 'all') {
        threshold = 0.99; // Essentially all visible
    } else {
        threshold = amount;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    callback(entry);
                }
            });
        },
        {
            root: root || null,
            rootMargin: margin,
            threshold
        }
    );

    observer.observe(el);

    // Cleanup function
    return () => {
        observer.disconnect();
    };
}

/**
 * Animate element when it enters the viewport
 *
 * @example
 * ```ts
 * import { inViewAnimate } from 'motion-start';
 *
 * // Fade in when element enters viewport
 * const cleanup = inViewAnimate(
 *   '.box',
 *   { opacity: [0, 1], y: [20, 0] },
 *   { margin: '-100px' }
 * );
 * ```
 */
export function inViewAnimate(
    element: Element | string,
    values: TargetAndTransition,
    options: InViewOptions & AnimationOptions = {}
): () => void {
    const { root, margin, amount, ...animationOptions } = options;

    return inView(
        element,
        () => {
            animate(element, values, animationOptions);
        },
        { root, margin, amount }
    );
}

/**
 * Get current viewport intersection info for an element
 *
 * @example
 * ```ts
 * import { getInViewInfo } from 'motion-start';
 *
 * const info = getInViewInfo('.box');
 * console.log('Is in view:', info.isIntersecting);
 * console.log('Intersection ratio:', info.intersectionRatio);
 * ```
 */
export function getInViewInfo(
    element: Element | string,
    options: InViewOptions = {}
): Promise<IntersectionObserverEntry> {
    return new Promise((resolve) => {
        const cleanup = inView(element, (entry) => {
            resolve(entry);
            cleanup();
        }, options);
    });
}
