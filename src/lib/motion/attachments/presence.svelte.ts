/**
 * Presence Attachment
 *
 * Handles exit animations for elements being removed from the DOM
 *
 * @example
 * ```svelte
 * {#if show}
 *   <div {@attach presence({
 *     exit: { opacity: 0, scale: 0.9 },
 *     transition: { duration: 0.2 }
 *   })} />
 * {/if}
 * ```
 */

import type { AnimationTarget } from '../types/motion.js';
import type { TransitionOptions } from '../animation/types.js';
import { animate } from '../animation/animate.js';
import { getPresenceContext, generatePresenceId } from '../context/presence.svelte.js';
import {
	buildTransform,
	splitProperties,
	isTransformKey,
	formatStyleValue,
	parseValue,
	getDefaultUnit
} from '../utils/transforms.js';

export type PresenceProps = {
	/** Exit animation target */
	exit?: AnimationTarget;
	/** Transition for exit animation */
	transition?: TransitionOptions;
	/** Callback when exit starts */
	onExitStart?: () => void;
	/** Callback when exit completes */
	onExitComplete?: () => void;
	/** Custom value for dynamic variants */
	custom?: any;
};

/**
 * Create a presence attachment for exit animations
 *
 * Note: This works best with AnimatePresence component or
 * manual presence management
 */
export function presence(props: PresenceProps) {
	return (element: HTMLElement) => {
		const context = getPresenceContext();
		const id = generatePresenceId();
		const transforms = new Map<string, number>();

		// Parse initial transform values from element
		const computedStyle = getComputedStyle(element);
		const currentTransform = computedStyle.transform;

		// Register exit handler with presence context
		async function performExit(): Promise<void> {
			if (!props.exit) return;

			props.onExitStart?.();

			return new Promise((resolve) => {
				const target = props.exit!;
				const transition = target.transition ?? props.transition ?? { duration: 0.2 };
				const { transforms: transformProps, styles } = splitProperties(target as any);

				const animations: Promise<void>[] = [];

				// Animate transform properties
				for (const [key, toValue] of Object.entries(transformProps)) {
					const fromValue = transforms.get(key) ?? getTransformDefault(key);
					let targetValue = toValue as number;

					if (typeof toValue === 'string') {
						targetValue = parseValue(toValue, getDefaultUnit(key)).value;
					}

					const anim = animate(fromValue, targetValue, {
						...transition,
						onUpdate: (v) => {
							transforms.set(key, v);
							const transformValues: Record<string, number> = {};
							for (const [k, val] of transforms) {
								transformValues[k] = val;
							}
							element.style.transform = buildTransform(transformValues as any);
						}
					});

					animations.push(anim.finished);
				}

				// Animate style properties
				for (const [key, toValue] of Object.entries(styles)) {
					const computed = computedStyle.getPropertyValue(camelToKebab(key));
					const fromValue = parseFloat(computed) || (key === 'opacity' ? 1 : 0);
					let targetValue = toValue as number;

					if (typeof toValue === 'string') {
						targetValue = parseFloat(toValue) || 0;
					}

					const anim = animate(fromValue, targetValue, {
						...transition,
						onUpdate: (v) => {
							(element.style as any)[key] = formatStyleValue(key, v);
						}
					});

					animations.push(anim.finished);
				}

				Promise.all(animations).then(() => {
					props.onExitComplete?.();
					resolve();
				});
			});
		}

		// Register with presence context if available
		if (context) {
			context.register(id, performExit);
		}

		// Store the exit function on the element for manual triggering
		(element as any).__motionExit = performExit;

		return () => {
			if (context) {
				context.unregister(id);
			}
			delete (element as any).__motionExit;
		};
	};
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
 * Trigger exit animation manually on an element
 */
export async function triggerExit(element: HTMLElement): Promise<void> {
	const exit = (element as any).__motionExit;
	if (exit) {
		await exit();
	}
}

/**
 * Check if element has exit animation
 */
export function hasExitAnimation(element: HTMLElement): boolean {
	return typeof (element as any).__motionExit === 'function';
}
