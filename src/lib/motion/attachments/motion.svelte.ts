/**
 * Motion Attachment
 *
 * The core attachment for animating elements in Svelte 5
 *
 * @example
 * ```svelte
 * <div {@attach motion({
 *   initial: { opacity: 0, y: 20 },
 *   animate: { opacity: 1, y: 0 },
 *   whileHover: { scale: 1.05 },
 *   transition: { type: 'spring' }
 * })} />
 * ```
 */

import { untrack } from 'svelte';
import type { MotionProps, AnimationTarget, Variants } from '../types/motion.js';
import type { TransitionOptions } from '../animation/types.js';
import { animate, animateValues } from '../animation/animate.js';
import { getAnimationTarget, targetsEqual, getChangedProperties } from '../utils/variants.js';
import {
	buildTransform,
	buildTransformOrigin,
	splitProperties,
	isTransformKey,
	formatStyleValue,
	parseValue,
	getDefaultUnit
} from '../utils/transforms.js';

type AnimationState = {
	target: AnimationTarget;
	activeAnimations: Map<string, { stop: () => void }>;
};

type GestureState = {
	isHovering: boolean;
	isTapping: boolean;
	isFocused: boolean;
	isDragging: boolean;
	isInView: boolean;
};

/**
 * Get the current value of a property from the element
 */
function getCurrentValue(element: HTMLElement, key: string, transforms: Map<string, number>): number {
	if (isTransformKey(key)) {
		return transforms.get(key) ?? getTransformDefault(key);
	}

	// For style properties, parse from computed style
	const computed = getComputedStyle(element);
	const value = computed.getPropertyValue(camelToKebab(key));

	if (key === 'opacity') {
		return parseFloat(value) || 1;
	}

	return parseFloat(value) || 0;
}

function camelToKebab(str: string): string {
	return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function getTransformDefault(key: string): number {
	if (key === 'scale' || key === 'scaleX' || key === 'scaleY' || key === 'scaleZ') {
		return 1;
	}
	return 0;
}

/**
 * Apply styles and transforms to element
 */
function applyStyles(
	element: HTMLElement,
	values: Record<string, number | string>,
	transforms: Map<string, number>
): void {
	const { transforms: transformProps, styles } = splitProperties(values as any);

	// Update transform tracking
	for (const [key, value] of Object.entries(transformProps)) {
		if (typeof value === 'number') {
			transforms.set(key, value);
		} else {
			const parsed = parseValue(value, getDefaultUnit(key));
			transforms.set(key, parsed.value);
		}
	}

	// Build and apply transform
	const transformValues: Record<string, number> = {};
	for (const [key, value] of transforms) {
		transformValues[key] = value;
	}
	const transformStr = buildTransform(transformValues as any);
	if (transformStr) {
		element.style.transform = transformStr;
	}

	// Apply transform origin
	const origin = buildTransformOrigin(transformProps);
	if (origin) {
		element.style.transformOrigin = origin;
	}

	// Apply other styles
	for (const [key, value] of Object.entries(styles)) {
		(element.style as any)[key] = formatStyleValue(key, value);
	}
}

/**
 * Animate to a target
 */
function animateToTarget(
	element: HTMLElement,
	from: AnimationTarget,
	to: AnimationTarget,
	transition: TransitionOptions | undefined,
	transforms: Map<string, number>,
	activeAnimations: Map<string, { stop: () => void }>,
	onComplete?: () => void
): void {
	const changedProps = getChangedProperties(from, to);
	if (changedProps.size === 0) {
		onComplete?.();
		return;
	}

	// Stop any active animations for these properties
	for (const prop of changedProps) {
		const existing = activeAnimations.get(prop);
		if (existing) {
			existing.stop();
			activeAnimations.delete(prop);
		}
	}

	// Get transition options (per-property or default)
	const defaultTransition = to.transition ?? transition ?? { type: 'spring' as const, stiffness: 500, damping: 25 };

	const animationPromises: Promise<void>[] = [];

	for (const prop of changedProps) {
		const fromValue = getCurrentValue(element, prop, transforms);
		let toValue = (to as any)[prop];

		// Parse string values
		if (typeof toValue === 'string') {
			const parsed = parseValue(toValue, isTransformKey(prop) ? getDefaultUnit(prop) : 'px');
			toValue = parsed.value;
		}

		const controls = animate(fromValue, toValue, {
			...defaultTransition,
			onUpdate: (v) => {
				if (isTransformKey(prop)) {
					transforms.set(prop, v);
					const transformValues: Record<string, number> = {};
					for (const [k, val] of transforms) {
						transformValues[k] = val;
					}
					element.style.transform = buildTransform(transformValues as any);
				} else {
					(element.style as any)[prop] = formatStyleValue(prop, v);
				}
			}
		});

		activeAnimations.set(prop, controls);
		animationPromises.push(
			controls.finished.then(() => {
				activeAnimations.delete(prop);
			})
		);
	}

	Promise.all(animationPromises).then(() => {
		onComplete?.();
	});
}

/**
 * Create the motion attachment
 */
export function motion(props: MotionProps) {
	return (element: HTMLElement) => {
		// Track current transform values
		const transforms = new Map<string, number>();

		// Track active animations per property
		const activeAnimations = new Map<string, { stop: () => void }>();

		// Gesture state
		const gestureState: GestureState = {
			isHovering: false,
			isTapping: false,
			isFocused: false,
			isDragging: false,
			isInView: false
		};

		// Current base target (from animate prop)
		let baseTarget: AnimationTarget = {};

		// Cleanup functions
		const cleanups: (() => void)[] = [];

		// Resolve initial state
		const initial = getAnimationTarget(props.initial, props.variants, props.custom);
		const animateTarget = getAnimationTarget(props.animate, props.variants, props.custom);

		// Apply initial state immediately (no animation)
		if (initial && props.initial !== false) {
			applyStyles(element, initial as Record<string, number | string>, transforms);
			baseTarget = initial;
		}

		// Animate to animate target
		if (animateTarget && !targetsEqual(initial, animateTarget)) {
			// Small delay to ensure initial styles are applied
			requestAnimationFrame(() => {
				animateToTarget(element, baseTarget, animateTarget, props.transition, transforms, activeAnimations, () => {
					props.onAnimationComplete?.(props.animate!);
				});
				baseTarget = animateTarget;
				props.onAnimationStart?.(props.animate!);
			});
		} else if (animateTarget) {
			baseTarget = animateTarget;
		}

		// Setup hover gesture
		if (props.whileHover) {
			const hoverTarget = getAnimationTarget(props.whileHover, props.variants, props.custom);

			const onPointerEnter = (e: PointerEvent) => {
				if (gestureState.isHovering) return;
				gestureState.isHovering = true;
				props.onHoverStart?.(e);

				if (hoverTarget) {
					animateToTarget(element, baseTarget, hoverTarget, props.transition, transforms, activeAnimations);
				}
			};

			const onPointerLeave = (e: PointerEvent) => {
				if (!gestureState.isHovering) return;
				gestureState.isHovering = false;
				props.onHoverEnd?.(e);

				// Return to base target (unless other gestures are active)
				const returnTarget = getActiveTarget(gestureState, props, baseTarget);
				animateToTarget(element, hoverTarget!, returnTarget, props.transition, transforms, activeAnimations);
			};

			element.addEventListener('pointerenter', onPointerEnter);
			element.addEventListener('pointerleave', onPointerLeave);

			cleanups.push(() => {
				element.removeEventListener('pointerenter', onPointerEnter);
				element.removeEventListener('pointerleave', onPointerLeave);
			});
		}

		// Setup tap gesture
		if (props.whileTap) {
			const tapTarget = getAnimationTarget(props.whileTap, props.variants, props.custom);

			const onPointerDown = (e: PointerEvent) => {
				if (gestureState.isTapping) return;
				gestureState.isTapping = true;
				props.onTapStart?.(e);

				if (tapTarget) {
					animateToTarget(
						element,
						getActiveTarget(gestureState, props, baseTarget),
						{ ...getActiveTarget(gestureState, props, baseTarget), ...tapTarget },
						props.transition,
						transforms,
						activeAnimations
					);
				}
			};

			const onPointerUp = (e: PointerEvent) => {
				if (!gestureState.isTapping) return;
				gestureState.isTapping = false;

				// Check if pointer is still over element
				const rect = element.getBoundingClientRect();
				const isOver =
					e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

				if (isOver) {
					props.onTap?.(e);
				} else {
					props.onTapCancel?.(e);
				}

				const returnTarget = getActiveTarget(gestureState, props, baseTarget);
				animateToTarget(element, tapTarget!, returnTarget, props.transition, transforms, activeAnimations);
			};

			element.addEventListener('pointerdown', onPointerDown);
			window.addEventListener('pointerup', onPointerUp);

			cleanups.push(() => {
				element.removeEventListener('pointerdown', onPointerDown);
				window.removeEventListener('pointerup', onPointerUp);
			});
		}

		// Setup focus gesture
		if (props.whileFocus) {
			const focusTarget = getAnimationTarget(props.whileFocus, props.variants, props.custom);

			const onFocus = (e: FocusEvent) => {
				if (gestureState.isFocused) return;
				gestureState.isFocused = true;
				props.onFocusStart?.(e);

				if (focusTarget) {
					animateToTarget(
						element,
						getActiveTarget(gestureState, props, baseTarget),
						{ ...getActiveTarget(gestureState, props, baseTarget), ...focusTarget },
						props.transition,
						transforms,
						activeAnimations
					);
				}
			};

			const onBlur = (e: FocusEvent) => {
				if (!gestureState.isFocused) return;
				gestureState.isFocused = false;
				props.onFocusEnd?.(e);

				const returnTarget = getActiveTarget(gestureState, props, baseTarget);
				animateToTarget(element, focusTarget!, returnTarget, props.transition, transforms, activeAnimations);
			};

			element.addEventListener('focus', onFocus);
			element.addEventListener('blur', onBlur);

			// Make element focusable if not already
			if (!element.hasAttribute('tabindex')) {
				element.setAttribute('tabindex', '0');
			}

			cleanups.push(() => {
				element.removeEventListener('focus', onFocus);
				element.removeEventListener('blur', onBlur);
			});
		}

		// Setup viewport detection
		if (props.whileInView) {
			const inViewTarget = getAnimationTarget(props.whileInView, props.variants, props.custom);
			const { root, margin, amount, once } = props.viewport ?? {};

			const threshold = amount === 'all' ? 1 : amount === 'some' ? 0 : (amount ?? 0);

			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							gestureState.isInView = true;
							props.onViewportEnter?.(entry);

							if (inViewTarget) {
								animateToTarget(
									element,
									baseTarget,
									{ ...baseTarget, ...inViewTarget },
									props.transition,
									transforms,
									activeAnimations
								);
							}

							if (once) {
								observer.unobserve(element);
							}
						} else if (!once) {
							gestureState.isInView = false;
							props.onViewportLeave?.(entry);

							animateToTarget(element, inViewTarget!, baseTarget, props.transition, transforms, activeAnimations);
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

			cleanups.push(() => {
				observer.disconnect();
			});
		}

		// Return cleanup function
		return () => {
			// Stop all active animations
			for (const [, anim] of activeAnimations) {
				anim.stop();
			}
			activeAnimations.clear();

			// Run all cleanups
			for (const cleanup of cleanups) {
				cleanup();
			}
		};
	};
}

/**
 * Get the currently active target based on gesture state
 */
function getActiveTarget(state: GestureState, props: MotionProps, baseTarget: AnimationTarget): AnimationTarget {
	let target = { ...baseTarget };

	// Layer gesture targets (order matters: hover < focus < tap < drag)
	if (state.isHovering && props.whileHover) {
		const hoverTarget = getAnimationTarget(props.whileHover, props.variants, props.custom);
		if (hoverTarget) target = { ...target, ...hoverTarget };
	}

	if (state.isFocused && props.whileFocus) {
		const focusTarget = getAnimationTarget(props.whileFocus, props.variants, props.custom);
		if (focusTarget) target = { ...target, ...focusTarget };
	}

	if (state.isTapping && props.whileTap) {
		const tapTarget = getAnimationTarget(props.whileTap, props.variants, props.custom);
		if (tapTarget) target = { ...target, ...tapTarget };
	}

	if (state.isDragging && props.whileDrag) {
		const dragTarget = getAnimationTarget(props.whileDrag, props.variants, props.custom);
		if (dragTarget) target = { ...target, ...dragTarget };
	}

	if (state.isInView && props.whileInView) {
		const inViewTarget = getAnimationTarget(props.whileInView, props.variants, props.custom);
		if (inViewTarget) target = { ...target, ...inViewTarget };
	}

	return target;
}

/**
 * Export a reactive version that tracks prop changes
 */
export function createMotion(getProps: () => MotionProps) {
	return (element: HTMLElement) => {
		let cleanup: (() => void) | undefined;
		let currentProps = getProps();

		// Initial setup
		cleanup = motion(currentProps)(element);

		// Create an effect to track prop changes
		$effect(() => {
			const newProps = getProps();

			// Check if animate target changed
			const oldAnimate = getAnimationTarget(currentProps.animate, currentProps.variants, currentProps.custom);
			const newAnimate = getAnimationTarget(newProps.animate, newProps.variants, newProps.custom);

			if (!targetsEqual(oldAnimate, newAnimate)) {
				// Re-run with new props
				cleanup?.();
				cleanup = motion(newProps)(element);
			}

			currentProps = newProps;
		});

		return () => {
			cleanup?.();
		};
	};
}
