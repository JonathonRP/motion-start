/**
 * Focus Gesture Hook
 * Detects focus state changes
 *
 * Based on framer-motion@11.11.11
 * @module use-focus-gesture
 */

import type { VisualElement } from '../render/types.js';
import { AnimationType } from '../render/utils/types.js';

/**
 * Focus gesture event handlers
 */
export interface FocusGestureHandlers {
	/** Variant to animate to while focused */
	whileFocus?: string | Record<string, any>;
}

/**
 * Use focus gesture detection
 *
 * Detects focus state on an element with support for:
 * - Focus/blur state tracking
 * - whileFocus animation variant
 * - Automatic cleanup
 *
 * @example
 * ```svelte
 * <script>
 *   import { useFocusGesture } from 'motion-start/gestures';
 *
 *   let visualElement = $state();
 *   let props = $props();
 *
 *   useFocusGesture(
 *     () => visualElement,
 *     () => props
 *   );
 * </script>
 * ```
 *
 * @param getVisualElement - Function returning the visual element
 * @param getHandlers - Function returning focus gesture handlers
 * @public
 */
export function useFocusGesture(
	getVisualElement: () => VisualElement | undefined,
	getHandlers: () => FocusGestureHandlers
): void {
	$effect(() => {
		const visualElement = getVisualElement();
		const handlers = getHandlers();

		if (!visualElement || !handlers.whileFocus) {
			return;
		}

		const instance = visualElement.getInstance();
		if (!instance) return;

		const onFocus = () => {
			visualElement.animationState?.setActive(AnimationType.Focus, true);
		};

		const onBlur = () => {
			visualElement.animationState?.setActive(AnimationType.Focus, false);
		};

		instance.addEventListener('focus', onFocus);
		instance.addEventListener('blur', onBlur);

		return () => {
			instance.removeEventListener('focus', onFocus);
			instance.removeEventListener('blur', onBlur);
		};
	});
}
