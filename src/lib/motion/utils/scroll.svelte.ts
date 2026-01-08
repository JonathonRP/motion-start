/**
 * Scroll Utilities
 *
 * Track scroll position and progress for scroll-linked animations
 */

import { motionValue, type MotionValueState } from '../core/motion-value.svelte.js';

export type ScrollInfo = {
	x: MotionValueState<number>;
	y: MotionValueState<number>;
	xProgress: MotionValueState<number>;
	yProgress: MotionValueState<number>;
};

export type ScrollOptions = {
	/** Target element (defaults to window) */
	target?: HTMLElement | Window;
	/** Offset from start [top, bottom] in pixels or viewport units */
	offset?: [string | number, string | number];
	/** Axis to track */
	axis?: 'x' | 'y' | 'both';
};

/**
 * Track scroll position of an element or window
 *
 * @example
 * ```svelte
 * <script>
 *   import { useScroll } from 'motion-start/motion';
 *
 *   const { scrollY, scrollYProgress } = useScroll();
 *
 *   $effect(() => {
 *     console.log('Scroll progress:', scrollYProgress.current);
 *   });
 * </script>
 * ```
 */
export function useScroll(options: ScrollOptions = {}): ScrollInfo {
	const { target, axis = 'both' } = options;

	const x = motionValue(0);
	const y = motionValue(0);
	const xProgress = motionValue(0);
	const yProgress = motionValue(0);

	function getScrollTarget(): { element: HTMLElement | Window; isWindow: boolean } {
		if (!target || target === window) {
			return { element: window, isWindow: true };
		}
		return { element: target as HTMLElement, isWindow: false };
	}

	function getScrollValues(element: HTMLElement | Window, isWindow: boolean) {
		if (isWindow) {
			const scrollX = window.scrollX;
			const scrollY = window.scrollY;
			const maxScrollX = document.documentElement.scrollWidth - window.innerWidth;
			const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

			return {
				x: scrollX,
				y: scrollY,
				xProgress: maxScrollX > 0 ? scrollX / maxScrollX : 0,
				yProgress: maxScrollY > 0 ? scrollY / maxScrollY : 0
			};
		}

		const el = element as HTMLElement;
		const scrollX = el.scrollLeft;
		const scrollY = el.scrollTop;
		const maxScrollX = el.scrollWidth - el.clientWidth;
		const maxScrollY = el.scrollHeight - el.clientHeight;

		return {
			x: scrollX,
			y: scrollY,
			xProgress: maxScrollX > 0 ? scrollX / maxScrollX : 0,
			yProgress: maxScrollY > 0 ? scrollY / maxScrollY : 0
		};
	}

	$effect(() => {
		const { element, isWindow } = getScrollTarget();

		function handleScroll() {
			const values = getScrollValues(element, isWindow);

			if (axis === 'x' || axis === 'both') {
				x.set(values.x);
				xProgress.set(values.xProgress);
			}

			if (axis === 'y' || axis === 'both') {
				y.set(values.y);
				yProgress.set(values.yProgress);
			}
		}

		// Initial values
		handleScroll();

		// Listen for scroll
		element.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			element.removeEventListener('scroll', handleScroll);
		};
	});

	return { x, y, xProgress, yProgress };
}

/**
 * Track scroll progress of an element within the viewport
 *
 * @example
 * ```svelte
 * <script>
 *   import { useScrollProgress } from 'motion-start/motion';
 *
 *   let element: HTMLElement;
 *   const progress = useScrollProgress(() => element);
 * </script>
 *
 * <div bind:this={element} style:opacity={progress.current}>
 *   Fades in as it scrolls into view
 * </div>
 * ```
 */
export function useScrollProgress(
	getElement: () => HTMLElement | null,
	options: { offset?: [string, string] } = {}
): MotionValueState<number> {
	const { offset = ['start end', 'end start'] } = options;

	const progress = motionValue(0);

	$effect(() => {
		const element = getElement();
		if (!element) return;

		function calculateProgress() {
			const rect = element!.getBoundingClientRect();
			const windowHeight = window.innerHeight;

			// Parse offsets
			const [startOffset, endOffset] = offset;

			// Simple calculation: 0 when element top hits viewport bottom,
			// 1 when element bottom leaves viewport top
			const totalDistance = windowHeight + rect.height;
			const currentPosition = windowHeight - rect.top;
			const rawProgress = currentPosition / totalDistance;

			progress.set(Math.max(0, Math.min(1, rawProgress)));
		}

		calculateProgress();

		window.addEventListener('scroll', calculateProgress, { passive: true });
		window.addEventListener('resize', calculateProgress, { passive: true });

		return () => {
			window.removeEventListener('scroll', calculateProgress);
			window.removeEventListener('resize', calculateProgress);
		};
	});

	return progress;
}

/**
 * Scroll-linked animation attachment
 *
 * @example
 * ```svelte
 * <div {@attach scrollAnimation({
 *   keyframes: { opacity: [0, 1], y: [50, 0] },
 *   offset: ['start end', 'end start']
 * })} />
 * ```
 */
export function scrollAnimation(options: {
	keyframes: Record<string, [number, number] | [number, number, number]>;
	offset?: [string, string];
}) {
	return (element: HTMLElement) => {
		const { keyframes, offset = ['start end', 'end start'] } = options;

		function interpolate(from: number, to: number, progress: number): number {
			return from + (to - from) * progress;
		}

		function applyValues(progress: number) {
			for (const [key, values] of Object.entries(keyframes)) {
				let value: number;

				if (values.length === 2) {
					value = interpolate(values[0], values[1], progress);
				} else {
					// 3 values: start, middle, end
					if (progress < 0.5) {
						value = interpolate(values[0], values[1], progress * 2);
					} else {
						value = interpolate(values[1], values[2], (progress - 0.5) * 2);
					}
				}

				// Apply to element
				if (key === 'opacity') {
					element.style.opacity = String(value);
				} else if (key === 'scale') {
					element.style.transform = `scale(${value})`;
				} else if (key === 'x') {
					element.style.transform = `translateX(${value}px)`;
				} else if (key === 'y') {
					element.style.transform = `translateY(${value}px)`;
				} else if (key === 'rotate') {
					element.style.transform = `rotate(${value}deg)`;
				}
			}
		}

		function calculateProgress() {
			const rect = element.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			const totalDistance = windowHeight + rect.height;
			const currentPosition = windowHeight - rect.top;
			const progress = Math.max(0, Math.min(1, currentPosition / totalDistance));

			applyValues(progress);
		}

		calculateProgress();

		window.addEventListener('scroll', calculateProgress, { passive: true });

		return () => {
			window.removeEventListener('scroll', calculateProgress);
		};
	};
}
