/**
 * Motion Hooks
 *
 * Modern runes-based hooks for imperative animation control.
 * Leverages Svelte's Spring and Tween primitives where appropriate.
 */

import { untrack } from 'svelte';
import { Spring as SvelteSpring, Tween as SvelteTween } from 'svelte/motion';
import type { TransitionOptions } from '../animation/types.js';
import type { AnimationTarget } from '../types/motion.js';
import { animate as animateFn, type AnimationPlaybackControls } from '../animation/animate.js';
import {
	buildTransform,
	splitProperties,
	isTransformKey,
	formatStyleValue,
	parseValue,
	getDefaultUnit
} from '../utils/transforms.js';
import { getEasingFunction } from '../animation/easing.js';

/**
 * useAnimate - Imperative animation control
 *
 * Returns an animate function scoped to a container element,
 * allowing you to animate child elements by selector.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useAnimate } from 'motion-start/motion';
 *
 *   let scope: HTMLElement;
 *   const animate = useAnimate(() => scope);
 *
 *   async function handleClick() {
 *     await animate('.box', { x: 100, opacity: 0.5 });
 *     await animate('.box', { x: 0, opacity: 1 });
 *   }
 * </script>
 *
 * <div bind:this={scope}>
 *   <div class="box">Animated</div>
 * </div>
 * ```
 */
export function useAnimate(getScope: () => HTMLElement | null | undefined) {
	type AnimateTarget = string | HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>;

	function animate(
		target: AnimateTarget,
		keyframes: AnimationTarget,
		options?: TransitionOptions
	): AnimationPlaybackControls {
		const scope = getScope();
		if (!scope) {
			return {
				stop: () => {},
				finished: Promise.resolve(),
				then: (resolve) => Promise.resolve().then(resolve)
			};
		}

		// Resolve target elements
		let elements: HTMLElement[];
		if (typeof target === 'string') {
			elements = Array.from(scope.querySelectorAll<HTMLElement>(target));
		} else if (target instanceof HTMLElement) {
			elements = [target];
		} else {
			elements = Array.from(target);
		}

		if (elements.length === 0) {
			return {
				stop: () => {},
				finished: Promise.resolve(),
				then: (resolve) => Promise.resolve().then(resolve)
			};
		}

		const defaultTransition: TransitionOptions = options ?? {
			type: 'spring',
			stiffness: 400,
			damping: 25
		};

		const { transforms: transformProps, styles } = splitProperties(keyframes as any);
		const allAnimations: AnimationPlaybackControls[] = [];

		for (const element of elements) {
			const elementTransforms = new Map<string, number>();

			// Animate transform properties
			for (const [key, toValue] of Object.entries(transformProps)) {
				const fromValue = getCurrentTransformValue(element, key);
				let targetValue = toValue as number;

				if (typeof toValue === 'string') {
					targetValue = parseValue(toValue, getDefaultUnit(key)).value;
				}

				const anim = animateFn(fromValue, targetValue, {
					...defaultTransition,
					onUpdate: (v) => {
						elementTransforms.set(key, v);
						const transformValues: Record<string, number> = {};
						for (const [k, val] of elementTransforms) {
							transformValues[k] = val;
						}
						element.style.transform = buildTransform(transformValues as any);
					}
				});

				allAnimations.push(anim);
			}

			// Animate style properties
			for (const [key, toValue] of Object.entries(styles)) {
				const computed = getComputedStyle(element);
				const fromValue = parseFloat(computed.getPropertyValue(camelToKebab(key))) || (key === 'opacity' ? 1 : 0);
				let targetValue = toValue as number;

				if (typeof toValue === 'string') {
					targetValue = parseFloat(toValue) || 0;
				}

				const anim = animateFn(fromValue, targetValue, {
					...defaultTransition,
					onUpdate: (v) => {
						(element.style as any)[key] = formatStyleValue(key, v);
					}
				});

				allAnimations.push(anim);
			}
		}

		const finished = Promise.all(allAnimations.map((a) => a.finished)).then(() => {});

		return {
			stop: () => allAnimations.forEach((a) => a.stop()),
			finished,
			then: (resolve, reject) => finished.then(resolve, reject)
		};
	}

	return animate;
}

function getCurrentTransformValue(element: HTMLElement, key: string): number {
	// Try to parse from current transform
	const transform = element.style.transform;
	if (transform) {
		// Simple regex extraction (not comprehensive)
		if (key === 'x') {
			const match = transform.match(/translateX\((-?[\d.]+)px\)/);
			if (match) return parseFloat(match[1]);
		}
		if (key === 'y') {
			const match = transform.match(/translateY\((-?[\d.]+)px\)/);
			if (match) return parseFloat(match[1]);
		}
		if (key === 'scale') {
			const match = transform.match(/scale\((-?[\d.]+)\)/);
			if (match) return parseFloat(match[1]);
		}
		if (key === 'rotate') {
			const match = transform.match(/rotate\((-?[\d.]+)deg\)/);
			if (match) return parseFloat(match[1]);
		}
	}

	// Return defaults
	if (key === 'scale' || key === 'scaleX' || key === 'scaleY') return 1;
	return 0;
}

function camelToKebab(str: string): string {
	return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * useInView - Track element viewport intersection
 *
 * @example
 * ```svelte
 * <script>
 *   import { useInView } from 'motion-start/motion';
 *
 *   let element: HTMLElement;
 *   const isInView = useInView(() => element, { once: true });
 * </script>
 *
 * <div bind:this={element} class:visible={isInView.current}>
 *   {isInView.current ? 'In view!' : 'Not in view'}
 * </div>
 * ```
 */
export function useInView(
	getElement: () => HTMLElement | null | undefined,
	options: {
		root?: Element | null;
		margin?: string;
		amount?: 'some' | 'all' | number;
		once?: boolean;
	} = {}
) {
	let isInView = $state(false);
	let hasTriggered = false;

	const { root, margin, amount = 'some', once = false } = options;

	$effect(() => {
		const element = getElement();
		if (!element) return;

		// Don't re-observe if once triggered
		if (once && hasTriggered) return;

		const threshold = amount === 'all' ? 1 : amount === 'some' ? 0 : amount;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const inView = entry.isIntersecting;
					isInView = inView;

					if (inView && once) {
						hasTriggered = true;
						observer.disconnect();
					}
				}
			},
			{
				root,
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
		get current() {
			return isInView;
		}
	};
}

/**
 * useReducedMotion - Track user's reduced motion preference
 *
 * @example
 * ```svelte
 * <script>
 *   import { useReducedMotion } from 'motion-start/motion';
 *
 *   const prefersReduced = useReducedMotion();
 *
 *   const transition = $derived(
 *     prefersReduced.current
 *       ? { duration: 0 }
 *       : { type: 'spring' }
 *   );
 * </script>
 * ```
 */
export function useReducedMotion() {
	let prefersReduced = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;

		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		prefersReduced = mediaQuery.matches;

		function handleChange(event: MediaQueryListEvent) {
			prefersReduced = event.matches;
		}

		mediaQuery.addEventListener('change', handleChange);

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	});

	return {
		get current() {
			return prefersReduced;
		}
	};
}

/**
 * useDragControls - Control drag gesture programmatically
 *
 * @example
 * ```svelte
 * <script>
 *   import { useDragControls, draggable } from 'motion-start/motion';
 *
 *   const dragControls = useDragControls();
 * </script>
 *
 * <button onpointerdown={(e) => dragControls.start(e)}>
 *   Drag handle
 * </button>
 *
 * <div {@attach draggable({ dragControls })}>
 *   Draggable content
 * </div>
 * ```
 */
export function useDragControls() {
	let startHandler: ((event: PointerEvent) => void) | null = null;

	return {
		start(event: PointerEvent) {
			startHandler?.(event);
		},
		_setStartHandler(handler: (event: PointerEvent) => void) {
			startHandler = handler;
		}
	};
}

/**
 * useMotionValue - Create a reactive motion value
 *
 * @example
 * ```svelte
 * <script>
 *   import { useMotionValue, useTransform } from 'motion-start/motion';
 *
 *   const x = useMotionValue(0);
 *   const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
 * </script>
 *
 * <div style:transform="translateX({x.current}px)" style:opacity={opacity.current}>
 *   Drag me
 * </div>
 * ```
 */
export function useMotionValue<T extends number>(initial: T) {
	let value = $state(initial);
	let velocity = $state(0);
	let lastValue = initial;
	let lastTime = performance.now();

	function set(newValue: T) {
		const now = performance.now();
		const dt = (now - lastTime) / 1000;

		if (dt > 0) {
			velocity = (newValue - lastValue) / dt;
		}

		lastValue = value;
		lastTime = now;
		value = newValue;
	}

	return {
		get current() {
			return value;
		},
		set current(v: T) {
			set(v);
		},
		get velocity() {
			return velocity;
		},
		set,
		get() {
			return untrack(() => value);
		}
	};
}

/**
 * useTransform - Create a derived motion value
 *
 * @example
 * ```svelte
 * <script>
 *   const x = useMotionValue(0);
 *   const scale = useTransform(x, [0, 100], [1, 2]);
 *   const rotate = useTransform(x, [0, 100], [0, 180]);
 * </script>
 * ```
 */
export function useTransform<T extends number>(
	source: { current: T },
	inputRange: number[],
	outputRange: number[],
	options?: { clamp?: boolean }
) {
	const { clamp = true } = options ?? {};

	const output = $derived.by(() => {
		const input = source.current;

		// Find the range segment
		let i = 0;
		for (; i < inputRange.length - 1; i++) {
			if (input < inputRange[i + 1]) break;
		}
		i = Math.min(i, inputRange.length - 2);

		// Calculate progress within segment
		const inputStart = inputRange[i];
		const inputEnd = inputRange[i + 1];
		let progress = (input - inputStart) / (inputEnd - inputStart);

		if (clamp) {
			progress = Math.max(0, Math.min(1, progress));
		}

		// Interpolate output
		const outputStart = outputRange[i];
		const outputEnd = outputRange[i + 1];
		return outputStart + (outputEnd - outputStart) * progress;
	});

	return {
		get current() {
			return output;
		}
	};
}

/**
 * useSpring - Create a spring-animated motion value
 *
 * Built on Svelte's Spring primitive for efficient spring physics.
 *
 * @example
 * ```svelte
 * <script>
 *   const x = useMotionValue(0);
 *   const springX = useSpring(x, { stiffness: 0.3, damping: 0.8 });
 * </script>
 * ```
 */
export function useSpring(
	source: { current: number },
	config: { stiffness?: number; damping?: number; precision?: number } = {}
) {
	// Note: Svelte's Spring uses different scale (0-1) than physics-based (100s)
	const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = config;

	// Use Svelte's Spring.of() to automatically follow the source
	const spring = SvelteSpring.of(() => source.current, { stiffness, damping, precision });

	return {
		get current() {
			return spring.current;
		},
		/** Set spring parameters dynamically */
		set stiffness(value: number) {
			spring.stiffness = value;
		},
		set damping(value: number) {
			spring.damping = value;
		},
		/** Immediately snap to a value */
		snap(value: number) {
			spring.set(value, { instant: true });
		}
	};
}

/**
 * useTween - Create a time-based animated value
 *
 * Built on Svelte's Tween primitive for smooth time-based animations.
 *
 * @example
 * ```svelte
 * <script>
 *   const x = useMotionValue(0);
 *   const tweenX = useTween(x, { duration: 300, easing: 'easeOut' });
 * </script>
 * ```
 */
export function useTween(
	source: { current: number },
	config: {
		duration?: number;
		delay?: number;
		easing?: import('../animation/types.js').Easing | ((t: number) => number);
	} = {}
) {
	const { duration = 400, delay = 0, easing = 'linear' } = config;

	const easingFn = typeof easing === 'function' ? easing : getEasingFunction(easing);

	// Use Svelte's Tween.of() to automatically follow the source
	const tween = SvelteTween.of(() => source.current, { duration, delay, easing: easingFn });

	return {
		get current() {
			return tween.current;
		},
		/** Immediately snap to a value */
		snap(value: number) {
			tween.set(value, { duration: 0 });
		}
	};
}
