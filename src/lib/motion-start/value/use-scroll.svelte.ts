/**
 * useScroll hook for modern scroll-linked animations
 * Based on Motion v11.11.11
 *
 * Creates motion values that track scroll position and progress
 */

import { onMount } from 'svelte';
import { MotionValue } from './index.js';

export interface UseScrollOptions {
    /**
     * Element to track scroll on. If not provided, tracks viewport scroll.
     */
    container?: () => HTMLElement | null | undefined;

    /**
     * Element to track position in viewport
     */
    target?: () => HTMLElement | null | undefined;

    /**
     * Offset for the target element
     * @example "start end" - Triggers when target start hits viewport end
     * @example "end start" - Triggers when target end hits viewport start
     */
    offset?: [string, string];

    /**
     * Axis to track
     * @default "y"
     */
    axis?: "x" | "y";

    /**
     * Enable smooth scrolling
     * @default false
     */
    smooth?: boolean | number;
}

export interface ScrollMotionValues {
    /**
     * Scroll position in pixels (x-axis)
     */
    scrollX: MotionValue<number>;

    /**
     * Scroll position in pixels (y-axis)
     */
    scrollY: MotionValue<number>;

    /**
     * Scroll progress as a value between 0 and 1 (x-axis)
     */
    scrollXProgress: MotionValue<number>;

    /**
     * Scroll progress as a value between 0 and 1 (y-axis)
     */
    scrollYProgress: MotionValue<number>;
}

/**
 * Track scroll position and progress
 *
 * @example
 * ```svelte
 * <script>
 * import { useScroll, useTransform, Motion } from "motion-start";
 *
 * const { scrollYProgress } = useScroll();
 * const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
 * </script>
 *
 * <Motion.div style={{ opacity }} />
 * ```
 *
 * @example With container element
 * ```svelte
 * <script>
 * import { useScroll } from "motion-start";
 *
 * let containerRef = $state<HTMLElement | null>(null);
 * const { scrollYProgress } = useScroll({
 *   container: () => containerRef
 * });
 * </script>
 *
 * <div bind:this={containerRef} style="overflow: auto; height: 300px;">
 *   <!-- scrollable content -->
 * </div>
 * ```
 *
 * @param options - Scroll options
 * @returns Motion values for scroll position and progress
 */
export function useScroll(
    options: UseScrollOptions = {}
): ScrollMotionValues {
    const {
        container,
        target,
        offset,
        axis = "y",
        smooth = false
    } = options;

    const scrollX = new MotionValue(0);
    const scrollY = new MotionValue(0);
    const scrollXProgress = new MotionValue(0);
    const scrollYProgress = new MotionValue(0);

    onMount(() => {
        const containerElement = container?.() ?? window;
        const targetElement = target?.();

        const updateScroll = () => {
            if (containerElement === window) {
                const x = window.scrollX || window.pageXOffset;
                const y = window.scrollY || window.pageYOffset;

                scrollX.set(x);
                scrollY.set(y);

                const maxX = document.documentElement.scrollWidth - window.innerWidth;
                const maxY = document.documentElement.scrollHeight - window.innerHeight;

                scrollXProgress.set(maxX > 0 ? x / maxX : 0);
                scrollYProgress.set(maxY > 0 ? y / maxY : 0);
            } else {
                const element = containerElement as HTMLElement;
                const x = element.scrollLeft;
                const y = element.scrollTop;

                scrollX.set(x);
                scrollY.set(y);

                const maxX = element.scrollWidth - element.clientWidth;
                const maxY = element.scrollHeight - element.clientHeight;

                scrollXProgress.set(maxX > 0 ? x / maxX : 0);
                scrollYProgress.set(maxY > 0 ? y / maxY : 0);
            }
        };

        const updateTargetProgress = () => {
            if (!targetElement) return;

            const rect = targetElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Calculate progress based on target position in viewport
            const yProgress = 1 - (rect.top + rect.height) / (viewportHeight + rect.height);
            const xProgress = 1 - (rect.left + rect.width) / (viewportWidth + rect.width);

            scrollYProgress.set(Math.max(0, Math.min(1, yProgress)));
            scrollXProgress.set(Math.max(0, Math.min(1, xProgress)));
        };

        let rafId: number | undefined;
        let smoothValue = 0;

        const handleScroll = () => {
            if (targetElement) {
                updateTargetProgress();
            } else {
                if (smooth) {
                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(() => {
                        updateScroll();
                    });
                } else {
                    updateScroll();
                }
            }
        };

        // Initial update
        handleScroll();

        // Add scroll listener
        if (containerElement === window) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('resize', handleScroll, { passive: true });
        } else {
            (containerElement as HTMLElement).addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => {
            if (rafId) cancelAnimationFrame(rafId);

            if (containerElement === window) {
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleScroll);
            } else {
                (containerElement as HTMLElement).removeEventListener('scroll', handleScroll);
            }
        };
    });

    return {
        scrollX,
        scrollY,
        scrollXProgress,
        scrollYProgress
    };
}