/**
 * Stagger utility for creating staggered animation delays
 * Based on Motion v11.11.11
 */

export interface StaggerOptions {
    /**
     * The delay to stagger by (in seconds)
     */
    delay?: number;
    /**
     * The point from which to start the stagger
     * - "first": Start from the first element
     * - "center": Start from the center
     * - "last": Start from the last element
     * - number: Start from a specific index
     */
    from?: "first" | "center" | "last" | number;
    /**
     * Easing function to apply to the stagger
     */
    ease?: (progress: number) => number;
    /**
     * Start time offset
     */
    startDelay?: number;
}

/**
 * Create a staggered delay for animations
 *
 * @example
 * ```svelte
 * <script>
 * import { animate, stagger } from "motion-start";
 *
 * const items = document.querySelectorAll(".item");
 * animate(items, { opacity: 1 }, {
 *   delay: stagger(0.1, { from: "first" })
 * });
 * </script>
 * ```
 *
 * @param duration - The duration between each staggered animation
 * @param options - Stagger options
 * @returns A function that calculates the delay for each element
 */
export function stagger(
    duration: number = 0.1,
    options: StaggerOptions = {}
): (index: number, total: number) => number {
    const {
        from = "first",
        ease = (t) => t,
        startDelay = 0
    } = options;

    return (index: number, total: number): number => {
        let startIndex = 0;

        if (from === "center") {
            startIndex = Math.floor(total / 2);
        } else if (from === "last") {
            startIndex = total - 1;
        } else if (typeof from === "number") {
            startIndex = from;
        }

        const distance = Math.abs(index - startIndex);
        const progress = distance / Math.max(total - 1, 1);
        const easedProgress = ease(progress);

        return startDelay + (easedProgress * duration * distance);
    };
}

/**
 * Simple stagger function for quick usage
 *
 * @param delayValue - The delay value in seconds
 * @returns A delay value (for backwards compatibility)
 */
export function simpleStagger(delayValue: number): number {
    return delayValue;
}