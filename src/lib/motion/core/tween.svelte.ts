/**
 * Tween Animation - Built on Svelte's Tween primitive
 *
 * Re-exports and extends Svelte's Tween class with motion-specific utilities.
 * Use this for time-based animations with easing curves.
 */

import { Tween as SvelteTween } from 'svelte/motion';
import * as easings from 'svelte/easing';
import type { Easing } from '../animation/types.js';
import { getEasingFunction, type EasingFunction } from '../animation/easing.js';

// Re-export Svelte's Tween class directly for full control
export { Tween as SvelteTween } from 'svelte/motion';

export type TweenOptions<T = number> = {
	/** Animation duration in milliseconds. Default: 400 */
	duration?: number | ((from: T, to: T) => number);
	/** Delay before animation starts in milliseconds. Default: 0 */
	delay?: number;
	/** Easing function or name. Default: 'linear' */
	easing?: Easing | EasingFunction;
	/** Custom interpolation function */
	interpolate?: (from: T, to: T) => (t: number) => T;
};

export type TweenValue<T> = {
	/** Current animated value (reactive) */
	readonly current: T;
	/** Target value the tween is moving towards */
	target: T;
	/** Animate to a new value, returns promise that resolves when complete */
	set(value: T, opts?: TweenOptions<T>): Promise<void>;
	/** Immediately snap to value */
	snap(value: T): void;
};

/**
 * Resolves easing option to a function
 */
function resolveEasing(easing?: Easing | EasingFunction): EasingFunction {
	if (!easing) return easings.linear;
	if (typeof easing === 'function') return easing;
	return getEasingFunction(easing);
}

/**
 * Creates a tweened value using Svelte's Tween primitive.
 *
 * @example
 * ```svelte
 * <script>
 *   import { tween } from '$lib/motion';
 *
 *   const opacity = tween(0, { duration: 300, easing: 'easeOut' });
 *
 *   onMount(() => {
 *     opacity.target = 1; // Fade in
 *   });
 * </script>
 *
 * <div style="opacity: {opacity.current}" />
 * ```
 */
export function tween<T>(initial: T, options: TweenOptions<T> = {}): TweenValue<T> {
	const { duration = 400, delay = 0, easing, interpolate } = options;

	const svelteTween = new SvelteTween(initial, {
		duration,
		delay,
		easing: resolveEasing(easing),
		interpolate
	});

	return {
		get current() {
			return svelteTween.current;
		},
		get target() {
			return svelteTween.target;
		},
		set target(value: T) {
			svelteTween.target = value;
		},
		set(value: T, opts) {
			return svelteTween.set(value, {
				duration: opts?.duration ?? duration,
				delay: opts?.delay ?? delay,
				easing: resolveEasing(opts?.easing ?? easing),
				interpolate: opts?.interpolate ?? interpolate
			});
		},
		snap(value: T) {
			svelteTween.set(value, { duration: 0 });
		}
	};
}

/**
 * Creates a tween that follows a reactive value.
 * The tween automatically animates when the source changes.
 *
 * @example
 * ```svelte
 * <script>
 *   import { tweenFrom } from '$lib/motion';
 *
 *   let { progress } = $props();
 *
 *   // Automatically tweens to new values when `progress` prop changes
 *   const smoothProgress = tweenFrom(() => progress, {
 *     duration: 500,
 *     easing: 'easeInOut'
 *   });
 * </script>
 *
 * <progress value={smoothProgress.current} />
 * ```
 */
export function tweenFrom<T>(fn: () => T, options: TweenOptions<T> = {}): TweenValue<T> {
	const { duration = 400, delay = 0, easing, interpolate } = options;

	const svelteTween = SvelteTween.of(fn, {
		duration,
		delay,
		easing: resolveEasing(easing),
		interpolate
	});

	return {
		get current() {
			return svelteTween.current;
		},
		get target() {
			return svelteTween.target;
		},
		set target(value: T) {
			svelteTween.target = value;
		},
		set(value: T, opts) {
			return svelteTween.set(value, {
				duration: opts?.duration ?? duration,
				delay: opts?.delay ?? delay,
				easing: resolveEasing(opts?.easing ?? easing),
				interpolate: opts?.interpolate ?? interpolate
			});
		},
		snap(value: T) {
			svelteTween.set(value, { duration: 0 });
		}
	};
}

/**
 * Creates a tween for an object with multiple properties.
 *
 * @example
 * ```svelte
 * <script>
 *   import { tweenObject } from '$lib/motion';
 *
 *   const style = tweenObject(
 *     { x: 0, y: 0, scale: 1 },
 *     { duration: 300, easing: 'backOut' }
 *   );
 *
 *   function onClick() {
 *     style.target = { x: 100, y: 50, scale: 1.2 };
 *   }
 * </script>
 *
 * <div style="transform: translate({style.current.x}px, {style.current.y}px) scale({style.current.scale})" />
 * ```
 */
export function tweenObject<T extends Record<string, number>>(
	initial: T,
	options: TweenOptions<T> = {}
): TweenValue<T> {
	return tween(initial, options);
}

/**
 * Creates a color tween that interpolates between colors.
 *
 * @example
 * ```svelte
 * <script>
 *   import { tweenColor } from '$lib/motion';
 *
 *   const bg = tweenColor('#ff0000', { duration: 500 });
 *
 *   function toggle() {
 *     bg.target = bg.target === '#ff0000' ? '#0000ff' : '#ff0000';
 *   }
 * </script>
 *
 * <div style="background: {bg.current}" />
 * ```
 */
export function tweenColor(
	initial: string,
	options: Omit<TweenOptions<string>, 'interpolate'> = {}
): TweenValue<string> {
	return tween(initial, {
		...options,
		interpolate: (from, to) => {
			const fromRGB = parseColor(from);
			const toRGB = parseColor(to);

			return (t) => {
				const r = Math.round(fromRGB.r + (toRGB.r - fromRGB.r) * t);
				const g = Math.round(fromRGB.g + (toRGB.g - fromRGB.g) * t);
				const b = Math.round(fromRGB.b + (toRGB.b - fromRGB.b) * t);
				const a = fromRGB.a + (toRGB.a - fromRGB.a) * t;

				if (a < 1) {
					return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
				}
				return `rgb(${r}, ${g}, ${b})`;
			};
		}
	});
}

type RGB = { r: number; g: number; b: number; a: number };

function parseColor(color: string): RGB {
	// Handle hex colors
	if (color.startsWith('#')) {
		const hex = color.slice(1);
		if (hex.length === 3) {
			return {
				r: parseInt(hex[0] + hex[0], 16),
				g: parseInt(hex[1] + hex[1], 16),
				b: parseInt(hex[2] + hex[2], 16),
				a: 1
			};
		}
		if (hex.length === 6) {
			return {
				r: parseInt(hex.slice(0, 2), 16),
				g: parseInt(hex.slice(2, 4), 16),
				b: parseInt(hex.slice(4, 6), 16),
				a: 1
			};
		}
		if (hex.length === 8) {
			return {
				r: parseInt(hex.slice(0, 2), 16),
				g: parseInt(hex.slice(2, 4), 16),
				b: parseInt(hex.slice(4, 6), 16),
				a: parseInt(hex.slice(6, 8), 16) / 255
			};
		}
	}

	// Handle rgb/rgba
	const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
	if (rgbMatch) {
		return {
			r: parseInt(rgbMatch[1], 10),
			g: parseInt(rgbMatch[2], 10),
			b: parseInt(rgbMatch[3], 10),
			a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1
		};
	}

	// Default to black
	return { r: 0, g: 0, b: 0, a: 1 };
}
