/**
 * Tap Gesture Hook
 * Detects tap/click gestures with press state
 *
 * Based on framer-motion@11.11.11
 * @module use-tap-gesture
 */

import { pipe } from '../../utils/pipe.js';
import type { EventInfo } from '../../events/event-info.js';
import { addPointerEvent } from '../../events/use-pointer-event.js';
import type { VisualElement } from '../../render/types.js';
import { AnimationType } from '../../render/utils/types.js';
import { isDragActive } from '../drag/utils/lock.js';
import { isNodeOrChild } from '../utils/is-node-or-child.js';

/**
 * Tap gesture event handlers
 */
export interface TapGestureHandlers {
	/** Fired when the element is tapped/clicked */
	onTap?: (event: MouseEvent | TouchEvent | PointerEvent, info: EventInfo) => void;
	/** Fired when the tap starts (pointer down) */
	onTapStart?: (event: MouseEvent | TouchEvent | PointerEvent, info: EventInfo) => void;
	/** Fired when the tap is cancelled */
	onTapCancel?: (event: MouseEvent | TouchEvent | PointerEvent, info: EventInfo) => void;
	/** Variant to animate to while tapping */
	whileTap?: string | Record<string, any>;
}

/**
 * Use tap gesture detection
 *
 * Detects tap/click gestures on an element with support for:
 * - Press state tracking
 * - Cancellation detection
 * - whileTap animation variant
 * - Integration with drag gestures
 *
 * @example
 * ```svelte
 * <script>
 *   import { useTapGesture } from 'motion-start/gestures';
 *
 *   let visualElement = $state();
 *   let props = $props();
 *
 *   useTapGesture(
 *     () => visualElement,
 *     () => props
 *   );
 * </script>
 * ```
 *
 * @param getVisualElement - Function returning the visual element
 * @param getHandlers - Function returning tap gesture handlers
 * @public
 */
export function useTapGesture(
	getVisualElement: () => VisualElement | undefined,
	getHandlers: () => TapGestureHandlers
): void {
	let isPressing = $state(false);
	let cancelPointerEndListeners: Function | null = $state(null);

	function removePointerEndListener() {
		if (typeof cancelPointerEndListeners === 'function') {
			cancelPointerEndListeners();
		}
		cancelPointerEndListeners = null;
	}

	function checkPointerEnd() {
		const visualElement = getVisualElement();
		removePointerEndListener();
		isPressing = false;
		visualElement?.animationState?.setActive(AnimationType.Tap, false);
		return !isDragActive();
	}

	function onPointerUp(event: PointerEvent, info: EventInfo) {
		if (!checkPointerEnd()) return;

		const visualElement = getVisualElement();
		const handlers = getHandlers();

		/**
		 * We only count this as a tap gesture if the event.target is the same
		 * as, or a child of, this component's element
		 */
		const instance = visualElement?.getInstance();
		if (!isNodeOrChild(instance, event.target as Element)) {
			handlers.onTapCancel?.(event, info);
		} else {
			handlers.onTap?.(event, info);
		}
	}

	function onPointerCancel(event: PointerEvent, info: EventInfo) {
		if (!checkPointerEnd()) return;

		const handlers = getHandlers();
		handlers.onTapCancel?.(event, info);
	}

	function onPointerDown(event: PointerEvent, info: EventInfo) {
		if (isPressing) return;

		const visualElement = getVisualElement();
		const handlers = getHandlers();

		removePointerEndListener();
		isPressing = true;

		cancelPointerEndListeners = pipe(
			addPointerEvent(window, 'pointerup', onPointerUp as any),
			addPointerEvent(window, 'pointercancel', onPointerCancel as any)
		);

		handlers.onTapStart?.(event, info);
		visualElement?.animationState?.setActive(AnimationType.Tap, true);
	}

	$effect(() => {
		const visualElement = getVisualElement();
		const handlers = getHandlers();
		const hasPressListeners = !!(handlers.onTap || handlers.onTapStart || handlers.onTapCancel || handlers.whileTap);

		if (!visualElement || !hasPressListeners) {
			return;
		}

		const cleanup = addPointerEvent(visualElement.getInstance(), 'pointerdown', onPointerDown as any);

		return () => {
			cleanup();
			removePointerEndListener();
		};
	});
}
