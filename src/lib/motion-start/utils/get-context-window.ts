import type { VisualElement } from '../render/types.js';

/**
 * Gets the window context for a visual element
 * Returns the owner document's default view if the element exists
 * @param visualElement - Visual element to get window context for
 * @returns Window object or null
 * @see https://github.com/framer/motion/issues/2270
 */
export function getContextWindow({ current }: VisualElement<Element>) {
	return current ? current.ownerDocument.defaultView : null;
}
