/**
 * motionRef Attachment
 *
 * Attaches a VisualElement to a DOM node imperatively.
 * Returns a cleanup function that unmounts the element.
 *
 * This is an imperative attachment pattern, designed to be used
 * within $effect blocks or programmatically in TypeScript/JavaScript.
 *
 * @example
 * ```svelte
 * <script>
 *   import { motionRef } from 'motion-start/motion/attachments';
 *
 *   let element = $state<HTMLElement>();
 *   let visualElement = $state(createVisualElement());
 *
 *   $effect(() => {
 *     if (!element || !visualElement) return;
 *     return motionRef(element, visualElement);
 *   });
 * </script>
 *
 * <div bind:this={element}>
 *   Animated content
 * </div>
 * ```
 */

import type { VisualElement } from '../../render/types';

export interface MotionRefOptions {
	/** Optional external ref callback to invoke when element is attached */
	externalRef?: ((node: HTMLElement) => void) | null;
}

/**
 * Attaches a VisualElement to a DOM element
 *
 * @param element - The DOM element to attach the visual element to
 * @param visualElement - The visual element to attach
 * @param options - Optional configuration
 * @returns Cleanup function that unmounts the visual element
 */
export function motionRef(
	element: HTMLElement,
	visualElement: VisualElement,
	options?: MotionRefOptions
): () => void {
	// Mount the visual element
	visualElement.mount(element);

	// Call external ref if provided
	if (options?.externalRef) {
		options.externalRef(element);
	}

	// Return cleanup function
	return () => {
		visualElement.unmount?.();
	};
}

/**
 * Creates a bound motionRef attachment with predefined options
 *
 * @param visualElement - The visual element to attach
 * @param options - Optional configuration
 * @returns Attachment function that accepts only the element
 *
 * @example
 * ```svelte
 * <script>
 *   const attachMotion = createMotionRef(visualElement);
 *
 *   $effect(() => {
 *     if (!element) return;
 *     return attachMotion(element);
 *   });
 * </script>
 * ```
 */
export function createMotionRef(
	visualElement: VisualElement,
	options?: MotionRefOptions
): (element: HTMLElement) => () => void {
	return (element: HTMLElement) => motionRef(element, visualElement, options);
}
