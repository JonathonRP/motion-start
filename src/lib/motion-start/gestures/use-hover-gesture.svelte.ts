/**
 * Hover Gesture Hook
 * Detects hover gestures (mouse only)
 *
 * Based on framer-motion@11.11.11
 * @module use-hover-gesture
 */

import { addPointerEvent } from '../events/use-pointer-event.js';
import { AnimationType } from '../render/utils/types.js';
import { isDragActive } from './drag/utils/lock.js';
import { isMouseEvent } from './utils/event-type.js';
import type { VisualElement } from '../render/types.js';
import type { EventInfo } from '../events/event-info.js';

/**
 * Hover gesture event handlers
 */
export interface HoverGestureHandlers {
	/** Fired when the pointer enters the element (mouse only) */
	onHoverStart?: (event: MouseEvent | TouchEvent | PointerEvent, info: EventInfo) => void;
	/** Fired when the pointer leaves the element (mouse only) */
	onHoverEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: EventInfo) => void;
	/** Variant to animate to while hovering */
	whileHover?: string | Record<string, any>;
}

/**
 * Create hover event handler
 *
 * Filters out touch events and drag interactions to ensure
 * hover only triggers for actual mouse movement.
 *
 * @param visualElement - The visual element to update
 * @param isActive - Whether hover is starting or ending
 * @param callback - User callback to invoke
 * @returns Event handler function
 * @internal
 */
function createHoverEvent(
	visualElement: VisualElement | undefined,
	isActive: boolean,
	callback?: (event: MouseEvent | TouchEvent | PointerEvent, info: EventInfo) => void
) {
	return (event: PointerEvent, info: EventInfo) => {
		// Only process mouse events (not touch)
		if (!isMouseEvent(event)) return;

		// Don't trigger hover during drag interactions
		if (isDragActive()) return;

		callback?.(event, info);
		visualElement?.animationState?.setActive(AnimationType.Hover, isActive);
	};
}

/**
 * Use hover gesture detection
 *
 * Detects mouse hover gestures on an element with support for:
 * - Mouse-only detection (filters out touch)
 * - Integration with drag gestures
 * - whileHover animation variant
 * - Automatic cleanup
 *
 * @example
 * ```svelte
 * <script>
 *   import { useHoverGesture } from 'motion-start/gestures';
 *
 *   let visualElement = $state();
 *   let props = $props();
 *
 *   useHoverGesture(
 *     () => visualElement,
 *     () => props
 *   );
 * </script>
 * ```
 *
 * @param getVisualElement - Function returning the visual element
 * @param getHandlers - Function returning hover gesture handlers
 * @public
 */
export function useHoverGesture(
	getVisualElement: () => VisualElement | undefined,
	getHandlers: () => HoverGestureHandlers
): void {
	$effect(() => {
		const visualElement = getVisualElement();
		const handlers = getHandlers();
		const hasHoverListeners = !!(
			handlers.onHoverStart ||
			handlers.onHoverEnd ||
			handlers.whileHover
		);

		if (!visualElement || !hasHoverListeners) {
			return;
		}

		const instance = visualElement.getInstance();
		if (!instance) return;

		// Set up hover start listener
		const cleanupEnter = addPointerEvent(
			instance,
			'pointerenter',
			handlers.onHoverStart || handlers.whileHover
				? createHoverEvent(visualElement, true, handlers.onHoverStart)
				: undefined as any
		);

		// Set up hover end listener
		const cleanupLeave = addPointerEvent(
			instance,
			'pointerleave',
			handlers.onHoverEnd || handlers.whileHover
				? createHoverEvent(visualElement, false, handlers.onHoverEnd)
				: undefined as any
		);

		return () => {
			cleanupEnter?.();
			cleanupLeave?.();
		};
	});
}
