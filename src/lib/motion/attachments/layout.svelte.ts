/**
 * Layout Attachment
 *
 * FLIP-based layout animations that automatically animate
 * position and size changes
 *
 * @example
 * ```svelte
 * <div
 *   {@attach layout()}
 *   class={expanded ? 'large' : 'small'}
 * >
 *   Content that animates when class changes
 * </div>
 * ```
 */

import type { TransitionOptions } from '../animation/types.js';
import { animate } from '../animation/animate.js';

export type LayoutProps = {
	/** Enable layout animations: true | 'position' | 'size' */
	layout?: boolean | 'position' | 'size';
	/** Transition for layout animations */
	transition?: TransitionOptions;
	/** Callback when layout animation starts */
	onLayoutAnimationStart?: () => void;
	/** Callback when layout animation completes */
	onLayoutAnimationComplete?: () => void;
};

type BoundingBox = {
	x: number;
	y: number;
	width: number;
	height: number;
};

/**
 * Create a layout attachment for FLIP animations
 */
export function layout(props: LayoutProps = {}) {
	const { layout: layoutMode = true, transition, onLayoutAnimationStart, onLayoutAnimationComplete } = props;

	return (element: HTMLElement) => {
		let lastBox: BoundingBox | null = null;
		let isAnimating = false;
		let activeAnimations: { stop: () => void }[] = [];

		// Get current bounding box
		function getBox(): BoundingBox {
			const rect = element.getBoundingClientRect();
			return {
				x: rect.left,
				y: rect.top,
				width: rect.width,
				height: rect.height
			};
		}

		// Snapshot current position
		function snapshot() {
			lastBox = getBox();
		}

		// Animate from snapshot to current position
		function animate_() {
			if (!lastBox) return;

			const currentBox = getBox();

			// Calculate deltas
			const deltaX = lastBox.x - currentBox.x;
			const deltaY = lastBox.y - currentBox.y;
			const scaleX = lastBox.width / currentBox.width;
			const scaleY = lastBox.height / currentBox.height;

			// Check if there's actually a change
			const hasPositionChange = Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5;
			const hasSizeChange = Math.abs(scaleX - 1) > 0.01 || Math.abs(scaleY - 1) > 0.01;

			const shouldAnimatePosition = layoutMode === true || layoutMode === 'position';
			const shouldAnimateSize = layoutMode === true || layoutMode === 'size';

			if (
				(!hasPositionChange || !shouldAnimatePosition) &&
				(!hasSizeChange || !shouldAnimateSize)
			) {
				lastBox = currentBox;
				return;
			}

			// Stop any active animations
			for (const anim of activeAnimations) {
				anim.stop();
			}
			activeAnimations = [];
			isAnimating = true;

			onLayoutAnimationStart?.();

			// Current transform values
			let currentDeltaX = deltaX;
			let currentDeltaY = deltaY;
			let currentScaleX = scaleX;
			let currentScaleY = scaleY;

			function applyTransform() {
				const transforms: string[] = [];

				if (shouldAnimatePosition && (Math.abs(currentDeltaX) > 0.01 || Math.abs(currentDeltaY) > 0.01)) {
					transforms.push(`translate(${currentDeltaX}px, ${currentDeltaY}px)`);
				}

				if (shouldAnimateSize && (Math.abs(currentScaleX - 1) > 0.001 || Math.abs(currentScaleY - 1) > 0.001)) {
					transforms.push(`scale(${currentScaleX}, ${currentScaleY})`);
				}

				element.style.transform = transforms.join(' ');
			}

			// Apply initial inverted transform
			applyTransform();

			const defaultTransition: TransitionOptions = transition ?? {
				type: 'spring',
				stiffness: 500,
				damping: 30
			};

			const animations: Promise<void>[] = [];

			// Animate position back to 0
			if (shouldAnimatePosition && hasPositionChange) {
				if (Math.abs(deltaX) > 0.5) {
					const xAnim = animate(deltaX, 0, {
						...defaultTransition,
						onUpdate: (v) => {
							currentDeltaX = v;
							applyTransform();
						}
					});
					activeAnimations.push(xAnim);
					animations.push(xAnim.finished);
				}

				if (Math.abs(deltaY) > 0.5) {
					const yAnim = animate(deltaY, 0, {
						...defaultTransition,
						onUpdate: (v) => {
							currentDeltaY = v;
							applyTransform();
						}
					});
					activeAnimations.push(yAnim);
					animations.push(yAnim.finished);
				}
			}

			// Animate scale back to 1
			if (shouldAnimateSize && hasSizeChange) {
				if (Math.abs(scaleX - 1) > 0.01) {
					const sxAnim = animate(scaleX, 1, {
						...defaultTransition,
						onUpdate: (v) => {
							currentScaleX = v;
							applyTransform();
						}
					});
					activeAnimations.push(sxAnim);
					animations.push(sxAnim.finished);
				}

				if (Math.abs(scaleY - 1) > 0.01) {
					const syAnim = animate(scaleY, 1, {
						...defaultTransition,
						onUpdate: (v) => {
							currentScaleY = v;
							applyTransform();
						}
					});
					activeAnimations.push(syAnim);
					animations.push(syAnim.finished);
				}
			}

			Promise.all(animations).then(() => {
				element.style.transform = '';
				isAnimating = false;
				activeAnimations = [];
				lastBox = getBox();
				onLayoutAnimationComplete?.();
			});
		}

		// Initial snapshot
		snapshot();

		// Use ResizeObserver to detect size changes
		const resizeObserver = new ResizeObserver(() => {
			if (!isAnimating) {
				animate_();
			}
		});
		resizeObserver.observe(element);

		// Use MutationObserver to detect attribute/style changes
		const mutationObserver = new MutationObserver((mutations) => {
			// Check if class or style changed
			const relevant = mutations.some(
				(m) => m.attributeName === 'class' || m.attributeName === 'style'
			);

			if (relevant && !isAnimating) {
				// Delay to let styles apply
				requestAnimationFrame(() => {
					animate_();
				});
			}
		});

		mutationObserver.observe(element, {
			attributes: true,
			attributeFilter: ['class', 'style']
		});

		// Expose methods for manual triggering
		(element as any).__motionLayout = {
			snapshot,
			animate: animate_
		};

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();

			for (const anim of activeAnimations) {
				anim.stop();
			}

			delete (element as any).__motionLayout;
		};
	};
}

/**
 * Manually trigger layout animation on element
 */
export function animateLayout(element: HTMLElement) {
	const layoutApi = (element as any).__motionLayout;
	if (layoutApi) {
		layoutApi.animate();
	}
}

/**
 * Take a layout snapshot for later animation
 */
export function snapshotLayout(element: HTMLElement) {
	const layoutApi = (element as any).__motionLayout;
	if (layoutApi) {
		layoutApi.snapshot();
	}
}

/**
 * Batch layout animations using FLIP
 *
 * @example
 * ```ts
 * // Snapshot all elements
 * const elements = document.querySelectorAll('.item');
 * const flip = layoutGroup(elements);
 *
 * // Make DOM changes
 * container.appendChild(newElement);
 * reorderElements();
 *
 * // Animate all changes
 * flip.animate();
 * ```
 */
export function layoutGroup(elements: HTMLElement[] | NodeListOf<HTMLElement>) {
	const snapshots = new Map<HTMLElement, BoundingBox>();

	// Take snapshots of all elements
	function snapshot() {
		snapshots.clear();
		for (const el of elements) {
			const rect = el.getBoundingClientRect();
			snapshots.set(el, {
				x: rect.left,
				y: rect.top,
				width: rect.width,
				height: rect.height
			});
		}
	}

	// Animate all elements from snapshots to current positions
	function animate_(transition?: TransitionOptions) {
		const defaultTransition: TransitionOptions = transition ?? {
			type: 'spring',
			stiffness: 500,
			damping: 30
		};

		for (const el of elements) {
			const lastBox = snapshots.get(el);
			if (!lastBox) continue;

			const currentRect = el.getBoundingClientRect();
			const deltaX = lastBox.x - currentRect.left;
			const deltaY = lastBox.y - currentRect.top;

			if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) continue;

			// Apply inverted transform
			el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

			// Animate back to 0
			let currentX = deltaX;
			let currentY = deltaY;

			animate(deltaX, 0, {
				...defaultTransition,
				onUpdate: (v) => {
					currentX = v;
					el.style.transform = `translate(${currentX}px, ${currentY}px)`;
				}
			});

			animate(deltaY, 0, {
				...defaultTransition,
				onUpdate: (v) => {
					currentY = v;
					el.style.transform = `translate(${currentX}px, ${currentY}px)`;
				},
				onComplete: () => {
					el.style.transform = '';
				}
			});
		}
	}

	// Initial snapshot
	snapshot();

	return {
		snapshot,
		animate: animate_
	};
}
