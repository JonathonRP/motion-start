/**
 * useInView hook for viewport intersection detection
 * Based on Motion v11.11.11
 *
 * Detects when an element enters or leaves the viewport
 */

import { onMount } from 'svelte';

export interface UseInViewOptions {
    /**
     * Only trigger once when element enters view
     * @default false
     */
    once?: boolean;

    /**
     * Margin around the viewport for detection
     * @example "0px 0px -100px 0px"
     */
    margin?: string;

    /**
     * Percentage of element that must be visible to trigger
     * @default 0
     */
    amount?: number | "some" | "all";
}

/**
 * Detect when an element is in the viewport
 *
 * @example
 * ```svelte
 * <script>
 * import { useInView } from "motion-start";
 *
 * let ref = $state<HTMLElement | null>(null);
 * const isInView = useInView(ref, { once: true });
 * </script>
 *
 * <div bind:this={ref}>
 *   {#if isInView}
 *     <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
 *   {/if}
 * </div>
 * ```
 *
 * @param elementRef - Reference to the element to observe
 * @param options - InView options
 * @returns Reactive boolean indicating if element is in view
 */
export function useInView(
    elementRef: () => Element | null | undefined,
    options: UseInViewOptions = {}
): { readonly isInView: boolean } {
    const {
        once = false,
        margin = "0px",
        amount = 0
    } = options;

    let isInView = $state(false);
    let hasTriggered = false;

    onMount(() => {
        const element = elementRef();
        if (!element || typeof IntersectionObserver === 'undefined') {
            return;
        }

        let threshold: number | number[];
        if (amount === "some") {
            threshold = 0.01;
        } else if (amount === "all") {
            threshold = 0.99;
        } else {
            threshold = typeof amount === "number" ? amount : 0;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const inView = entry.isIntersecting;

                    if (once && hasTriggered && !inView) {
                        // If once is true and we've already triggered, don't update
                        return;
                    }

                    isInView = inView;

                    if (inView && once) {
                        hasTriggered = true;
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: margin,
                threshold
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    });

    return {
        get isInView() {
            return isInView;
        }
    };
}

/**
 * Callback-based useInView for more control
 *
 * @param elementRef - Reference to the element to observe
 * @param callback - Callback when visibility changes
 * @param options - InView options
 */
export function useInViewWithCallback(
    elementRef: () => Element | null | undefined,
    callback: (inView: boolean, entry: IntersectionObserverEntry) => void,
    options: UseInViewOptions = {}
): void {
    const {
        once = false,
        margin = "0px",
        amount = 0
    } = options;

    let hasTriggered = false;

    onMount(() => {
        const element = elementRef();
        if (!element || typeof IntersectionObserver === 'undefined') {
            return;
        }

        let threshold: number | number[];
        if (amount === "some") {
            threshold = 0.01;
        } else if (amount === "all") {
            threshold = 0.99;
        } else {
            threshold = typeof amount === "number" ? amount : 0;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const inView = entry.isIntersecting;

                    if (once && hasTriggered && !inView) {
                        return;
                    }

                    callback(inView, entry);

                    if (inView && once) {
                        hasTriggered = true;
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: margin,
                threshold
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    });
}