/**
 * Drag Gesture Handler
 *
 * Attachment for draggable elements with constraints, momentum, and snapping
 */

import type { DragProps, DragInfo, AnimationTarget } from '../types/motion.js';
import type { TransitionOptions } from '../animation/types.js';
import { animate } from '../animation/animate.js';

export type DragState = {
	isDragging: boolean;
	point: { x: number; y: number };
	offset: { x: number; y: number };
	velocity: { x: number; y: number };
};

type DragOptions = DragProps & {
	/** Current x transform value */
	x?: number;
	/** Current y transform value */
	y?: number;
	/** Callback to update transform values */
	onUpdate?: (values: { x?: number; y?: number }) => void;
	/** Callback when drag state changes */
	onDragStateChange?: (isDragging: boolean) => void;
};

/**
 * Create a draggable attachment
 */
export function draggable(options: DragOptions) {
	return (element: HTMLElement) => {
		const {
			drag = true,
			dragConstraints,
			dragElastic = 0.35,
			dragMomentum = true,
			dragTransition,
			dragDirectionLock = false,
			dragPropagation = false,
			dragSnapToOrigin = false,
			onDragStart,
			onDrag,
			onDragEnd,
			onDirectionLock,
			onUpdate,
			onDragStateChange
		} = options;

		// State
		let isDragging = false;
		let startPoint = { x: 0, y: 0 };
		let startOffset = { x: options.x ?? 0, y: options.y ?? 0 };
		let currentOffset = { ...startOffset };
		let velocity = { x: 0, y: 0 };
		let lockedAxis: 'x' | 'y' | null = null;
		let velocityHistory: { x: number; y: number; time: number }[] = [];

		// Constraints
		let constraints: { top: number; right: number; bottom: number; left: number } | null = null;

		// Active animations
		let activeAnimation: { stop: () => void } | null = null;

		function updateConstraints() {
			if (!dragConstraints) {
				constraints = null;
				return;
			}

			if ('current' in dragConstraints) {
				// Element constraint
				const parentRect = dragConstraints.current.getBoundingClientRect();
				const elementRect = element.getBoundingClientRect();

				constraints = {
					top: parentRect.top - elementRect.top + currentOffset.y,
					right: parentRect.right - elementRect.right + currentOffset.x,
					bottom: parentRect.bottom - elementRect.bottom + currentOffset.y,
					left: parentRect.left - elementRect.left + currentOffset.x
				};
			} else {
				constraints = dragConstraints as any;
			}
		}

		function getElastic(axis: 'x' | 'y'): number {
			if (typeof dragElastic === 'number') return dragElastic;
			if (axis === 'x') return dragElastic.left ?? dragElastic.right ?? 0.35;
			return dragElastic.top ?? dragElastic.bottom ?? 0.35;
		}

		function applyConstraints(x: number, y: number, elastic: boolean): { x: number; y: number } {
			if (!constraints) return { x, y };

			let constrainedX = x;
			let constrainedY = y;

			if (drag === true || drag === 'x') {
				if (x < constraints.left) {
					constrainedX = elastic
						? constraints.left + (x - constraints.left) * getElastic('x')
						: constraints.left;
				} else if (x > constraints.right) {
					constrainedX = elastic
						? constraints.right + (x - constraints.right) * getElastic('x')
						: constraints.right;
				}
			}

			if (drag === true || drag === 'y') {
				if (y < constraints.top) {
					constrainedY = elastic
						? constraints.top + (y - constraints.top) * getElastic('y')
						: constraints.top;
				} else if (y > constraints.bottom) {
					constrainedY = elastic
						? constraints.bottom + (y - constraints.bottom) * getElastic('y')
						: constraints.bottom;
				}
			}

			return { x: constrainedX, y: constrainedY };
		}

		function updateVelocity(x: number, y: number) {
			const now = performance.now();
			velocityHistory.push({ x, y, time: now });

			// Keep only last 50ms of history
			const cutoff = now - 50;
			velocityHistory = velocityHistory.filter((v) => v.time > cutoff);

			if (velocityHistory.length >= 2) {
				const oldest = velocityHistory[0];
				const newest = velocityHistory[velocityHistory.length - 1];
				const dt = (newest.time - oldest.time) / 1000;

				if (dt > 0) {
					velocity = {
						x: (newest.x - oldest.x) / dt,
						y: (newest.y - oldest.y) / dt
					};
				}
			}
		}

		function createDragInfo(): DragInfo {
			return {
				point: { ...currentOffset },
				delta: {
					x: currentOffset.x - startOffset.x,
					y: currentOffset.y - startOffset.y
				},
				offset: { ...currentOffset },
				velocity: { ...velocity }
			};
		}

		function handlePointerDown(e: PointerEvent) {
			if (isDragging) return;

			// Stop any active animation
			if (activeAnimation) {
				activeAnimation.stop();
				activeAnimation = null;
			}

			isDragging = true;
			onDragStateChange?.(true);

			startPoint = { x: e.clientX, y: e.clientY };
			startOffset = { ...currentOffset };
			velocity = { x: 0, y: 0 };
			velocityHistory = [];
			lockedAxis = null;

			updateConstraints();

			element.setPointerCapture(e.pointerId);
			onDragStart?.(e, createDragInfo());
		}

		function handlePointerMove(e: PointerEvent) {
			if (!isDragging) return;

			let deltaX = e.clientX - startPoint.x;
			let deltaY = e.clientY - startPoint.y;

			// Direction lock
			if (dragDirectionLock && !lockedAxis) {
				const absX = Math.abs(deltaX);
				const absY = Math.abs(deltaY);

				if (absX > 3 || absY > 3) {
					lockedAxis = absX > absY ? 'x' : 'y';
					onDirectionLock?.(lockedAxis);
				}
			}

			// Apply axis constraints
			if (drag === 'x' || lockedAxis === 'x') deltaY = 0;
			if (drag === 'y' || lockedAxis === 'y') deltaX = 0;

			let newX = startOffset.x + deltaX;
			let newY = startOffset.y + deltaY;

			// Apply constraints with elasticity during drag
			const constrained = applyConstraints(newX, newY, true);
			currentOffset = constrained;

			updateVelocity(currentOffset.x, currentOffset.y);

			onUpdate?.({
				x: drag === true || drag === 'x' ? currentOffset.x : undefined,
				y: drag === true || drag === 'y' ? currentOffset.y : undefined
			});

			onDrag?.(e, createDragInfo());

			if (!dragPropagation) {
				e.stopPropagation();
			}
		}

		function handlePointerUp(e: PointerEvent) {
			if (!isDragging) return;

			isDragging = false;
			element.releasePointerCapture(e.pointerId);

			onDragEnd?.(e, createDragInfo());

			// Determine target position
			let targetX = currentOffset.x;
			let targetY = currentOffset.y;

			if (dragSnapToOrigin) {
				targetX = 0;
				targetY = 0;
			} else if (dragMomentum) {
				// Apply momentum
				const power = 0.8;
				targetX += velocity.x * power * 0.1;
				targetY += velocity.y * power * 0.1;

				// Apply constraints to target
				const constrained = applyConstraints(targetX, targetY, false);
				targetX = constrained.x;
				targetY = constrained.y;
			} else {
				// Just apply constraints without momentum
				const constrained = applyConstraints(targetX, targetY, false);
				targetX = constrained.x;
				targetY = constrained.y;
			}

			// Animate to target
			const transition: TransitionOptions = dragTransition ?? {
				type: 'spring',
				stiffness: 400,
				damping: 40
			};

			const animateX = drag === true || drag === 'x';
			const animateY = drag === true || drag === 'y';

			if (animateX && Math.abs(targetX - currentOffset.x) > 0.01) {
				const xAnim = animate(currentOffset.x, targetX, {
					...transition,
					velocity: velocity.x,
					onUpdate: (v) => {
						currentOffset.x = v;
						onUpdate?.({ x: v });
					},
					onComplete: () => {
						onDragStateChange?.(false);
					}
				});

				activeAnimation = xAnim;
			}

			if (animateY && Math.abs(targetY - currentOffset.y) > 0.01) {
				const yAnim = animate(currentOffset.y, targetY, {
					...transition,
					velocity: velocity.y,
					onUpdate: (v) => {
						currentOffset.y = v;
						onUpdate?.({ y: v });
					}
				});

				if (!activeAnimation) {
					activeAnimation = yAnim;
				}
			}

			if (!activeAnimation) {
				onDragStateChange?.(false);
			}
		}

		// Setup event listeners
		element.addEventListener('pointerdown', handlePointerDown);
		element.addEventListener('pointermove', handlePointerMove);
		element.addEventListener('pointerup', handlePointerUp);
		element.addEventListener('pointercancel', handlePointerUp);

		// Touch action to prevent scrolling
		element.style.touchAction = drag === 'x' ? 'pan-y' : drag === 'y' ? 'pan-x' : 'none';

		return () => {
			if (activeAnimation) {
				activeAnimation.stop();
			}

			element.removeEventListener('pointerdown', handlePointerDown);
			element.removeEventListener('pointermove', handlePointerMove);
			element.removeEventListener('pointerup', handlePointerUp);
			element.removeEventListener('pointercancel', handlePointerUp);
		};
	};
}

/**
 * Pan gesture (like drag but doesn't move the element)
 */
export type PanInfo = {
	point: { x: number; y: number };
	delta: { x: number; y: number };
	offset: { x: number; y: number };
	velocity: { x: number; y: number };
};

export type PanHandlers = {
	onPanStart?: (event: PointerEvent, info: PanInfo) => void;
	onPan?: (event: PointerEvent, info: PanInfo) => void;
	onPanEnd?: (event: PointerEvent, info: PanInfo) => void;
};

export function pan(handlers: PanHandlers) {
	return (element: HTMLElement) => {
		let isPanning = false;
		let startPoint = { x: 0, y: 0 };
		let lastPoint = { x: 0, y: 0 };
		let velocity = { x: 0, y: 0 };
		let velocityHistory: { x: number; y: number; time: number }[] = [];

		function createPanInfo(e: PointerEvent): PanInfo {
			return {
				point: { x: e.clientX, y: e.clientY },
				delta: { x: e.clientX - lastPoint.x, y: e.clientY - lastPoint.y },
				offset: { x: e.clientX - startPoint.x, y: e.clientY - startPoint.y },
				velocity: { ...velocity }
			};
		}

		function updateVelocity(e: PointerEvent) {
			const now = performance.now();
			velocityHistory.push({ x: e.clientX, y: e.clientY, time: now });

			const cutoff = now - 50;
			velocityHistory = velocityHistory.filter((v) => v.time > cutoff);

			if (velocityHistory.length >= 2) {
				const oldest = velocityHistory[0];
				const newest = velocityHistory[velocityHistory.length - 1];
				const dt = (newest.time - oldest.time) / 1000;

				if (dt > 0) {
					velocity = {
						x: (newest.x - oldest.x) / dt,
						y: (newest.y - oldest.y) / dt
					};
				}
			}
		}

		function handlePointerDown(e: PointerEvent) {
			isPanning = true;
			startPoint = { x: e.clientX, y: e.clientY };
			lastPoint = { ...startPoint };
			velocity = { x: 0, y: 0 };
			velocityHistory = [];

			element.setPointerCapture(e.pointerId);
			handlers.onPanStart?.(e, createPanInfo(e));
		}

		function handlePointerMove(e: PointerEvent) {
			if (!isPanning) return;

			updateVelocity(e);
			handlers.onPan?.(e, createPanInfo(e));
			lastPoint = { x: e.clientX, y: e.clientY };
		}

		function handlePointerUp(e: PointerEvent) {
			if (!isPanning) return;

			isPanning = false;
			element.releasePointerCapture(e.pointerId);
			handlers.onPanEnd?.(e, createPanInfo(e));
		}

		element.addEventListener('pointerdown', handlePointerDown);
		element.addEventListener('pointermove', handlePointerMove);
		element.addEventListener('pointerup', handlePointerUp);
		element.addEventListener('pointercancel', handlePointerUp);

		return () => {
			element.removeEventListener('pointerdown', handlePointerDown);
			element.removeEventListener('pointermove', handlePointerMove);
			element.removeEventListener('pointerup', handlePointerUp);
			element.removeEventListener('pointercancel', handlePointerUp);
		};
	};
}
