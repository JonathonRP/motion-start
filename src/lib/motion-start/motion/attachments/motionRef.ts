/**
 * motionRef Attachment
 *
 * Svelte 5 attachment for connecting VisualElements to DOM nodes.
 * Use with {@attach} syntax in templates.
 *
 * @example
 * ```svelte
 * <script>
 *   import { motionRef } from 'motion-start';
 *
 *   let visualElement = $state(createVisualElement());
 *   const ref = motionRef(visualElement);
 * </script>
 *
 * <div {@attach ref}>
 *   Animated content
 * </div>
 * ```
 */

import type { VisualElement } from '../../render/types';

export interface MotionRefOptions {
	/** Optional external ref callback to invoke when element is attached */
	externalRef?: ((node: HTMLElement) => void) | null;
}

export interface MotionRefAttachment {
	(node: HTMLElement): void | (() => void);
}

/**
 * Creates a motionRef attachment for use with {@attach} syntax
 *
 * @param visualElement - The visual element to attach
 * @param options - Optional configuration
 * @returns Attachment function for {@attach} directive
 *
 * @example
 * ```svelte
 * <script>
 *   import { motionRef } from 'motion-start';
 *
 *   const ve = createVisualElement();
 *   const ref = motionRef(ve);
 * </script>
 *
 * <div {@attach ref}>Content</div>
 * ```
 */
export function motionRef(
	visualElement: VisualElement,
	options?: MotionRefOptions
): MotionRefAttachment {
	return (node: HTMLElement) => {
		// Mount the visual element
		visualElement.mount(node);

		// Call external ref if provided
		if (options?.externalRef) {
			options.externalRef(node);
		}

		// Return cleanup function
		return () => {
			visualElement.unmount?.();
		};
	};
}

/**
 * Creates a bound motionRef attachment factory
 * Useful for creating multiple refs with the same options
 *
 * @param options - Configuration options
 * @returns Factory function that creates attachments
 *
 * @example
 * ```svelte
 * <script>
 *   const createRef = createMotionRef({ externalRef: console.log });
 *   const ref1 = createRef(visualElement1);
 *   const ref2 = createRef(visualElement2);
 * </script>
 *
 * <div {@attach ref1}>Content 1</div>
 * <div {@attach ref2}>Content 2</div>
 * ```
 */
export function createMotionRef(
	options?: MotionRefOptions
): (visualElement: VisualElement) => MotionRefAttachment {
	return (visualElement: VisualElement) => motionRef(visualElement, options);
}
