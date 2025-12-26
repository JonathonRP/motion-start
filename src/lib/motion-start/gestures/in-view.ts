/**
 * InView gesture feature
 * Implements whileInView animations for Motion components
 * Based on Motion v11.11.11
 */

import type { VariantLabels } from '../motion/types.js';
import type { VisualElement } from '../render/types.js';
import type { TargetAndTransition } from '../types.js';
import { hasIntersectionObserver } from '../utils/environment.js';
import type { ViewportOptions } from './types.js';

export interface InViewGestureProps {
	whileInView?: VariantLabels | TargetAndTransition;
	viewport?: ViewportOptions;
	onViewportEnter?(): void;
	onViewportLeave?(): void;
}

/**
 * Add whileInView gesture support to a VisualElement
 */
export function addInViewGesture(element: VisualElement, props: InViewGestureProps): () => void {
	const { whileInView, viewport = {}, onViewportEnter, onViewportLeave } = props;

	if (!whileInView && !onViewportEnter && !onViewportLeave) {
		return () => {};
	}

	if (!hasIntersectionObserver) {
		console.warn('IntersectionObserver is not supported in this browser');
		return () => {};
	}

	const { once = false, margin = '0px', amount = 'some' } = viewport;

	// Convert amount to threshold
	let threshold: number | number[];
	if (amount === 'some') {
		threshold = 0.001; // Any intersection
	} else if (amount === 'all') {
		threshold = 0.99; // Nearly all visible
	} else {
		threshold = amount;
	}

	let isInView = false;
	let hasEnteredOnce = false;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const enteringView = entry.isIntersecting;

				// Handle entering viewport
				if (enteringView && !isInView) {
					isInView = true;
					hasEnteredOnce = true;

					// Trigger whileInView animation
					if (whileInView && element.animationState) {
						// Type assertion needed as whileInView is not in AnimationType yet
						element.animationState.setActive('whileInView' as any, true);
					}

					// Call onViewportEnter callback
					onViewportEnter?.();

					// If once=true, stop observing
					if (once) {
						observer.disconnect();
					}
				}
				// Handle leaving viewport
				else if (!enteringView && isInView) {
					isInView = false;

					// Stop whileInView animation
					if (whileInView && !once && element.animationState) {
						// Type assertion needed as whileInView is not in AnimationType yet
						element.animationState.setActive('whileInView' as any, false);
					}

					// Call onViewportLeave callback
					onViewportLeave?.();
				}
			});
		},
		{
			root: null,
			rootMargin: margin,
			threshold,
		}
	);

	// Observe the element
	const node = element.getInstance();
	if (node) {
		observer.observe(node);
	}

	// Cleanup function
	return () => {
		observer.disconnect();
	};
}
