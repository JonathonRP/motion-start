/**
 * motionRef Svelte Action
 *
 * Attaches a VisualElement to a DOM node, enabling motion animations.
 * This action pattern provides a more Svelte-idiomatic way to connect
 * visual elements to DOM nodes.
 *
 * @example
 * ```svelte
 * <script>
 *   import { motionRef } from 'motion-start/motion/actions';
 *   let visualElement = $state(createVisualElement());
 * </script>
 *
 * <div use:motionRef={visualElement}>
 *   Animated content
 * </div>
 * ```
 */

import type { VisualElement } from '../../render/types';
import type { Action } from 'svelte/action';

export interface MotionRefParameters {
	visualElement: VisualElement | null | undefined;
	externalRef?: ((node: HTMLElement) => void) | null;
}

/**
 * Svelte action that attaches a VisualElement to a DOM node
 *
 * @param node - The DOM element to attach the visual element to
 * @param params - Configuration object
 * @returns Action object with update and destroy methods
 */
export const motionRef: Action<
	HTMLElement,
	MotionRefParameters
> = (node, params) => {
	const { visualElement, externalRef } = params || {};

	// Mount the visual element
	if (visualElement) {
		visualElement.mount(node);
	}

	// Call external ref if provided
	if (externalRef) {
		externalRef(node);
	}

	return {
		update(newParams: MotionRefParameters) {
			const { visualElement: newVisualElement, externalRef: newExternalRef } = newParams || {};

			// Handle visual element changes
			if (newVisualElement !== visualElement) {
				// Unmount old visual element
				if (visualElement) {
					visualElement.unmount?.();
				}

				// Mount new visual element
				if (newVisualElement) {
					newVisualElement.mount(node);
				}
			}

			// Call new external ref if provided
			if (newExternalRef && newExternalRef !== externalRef) {
				newExternalRef(node);
			}
		},

		destroy() {
			// Unmount visual element on destroy
			if (visualElement) {
				visualElement.unmount?.();
			}
		}
	};
};

/**
 * Factory function to create a motionRef action with bound parameters
 * Useful for creating refs with curried parameters
 *
 * @example
 * ```svelte
 * <script>
 *   const myRef = createMotionRef(visualElement, externalRefCallback);
 * </script>
 *
 * <div use:myRef>Content</div>
 * ```
 */
export function createMotionRef(
	visualElement: VisualElement | null | undefined,
	externalRef?: ((node: HTMLElement) => void) | null
): Action<HTMLElement, void> {
	return (node) => {
		return motionRef(node, { visualElement, externalRef });
	};
}
