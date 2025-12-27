/**
 * Utility to detect if a component is a motion component
 *
 * This helps AnimatePresence and other components know when they're
 * working with motion-enhanced children.
 */

/**
 * Checks if a component instance is a motion component
 *
 * @param component - The component to check
 * @returns true if the component is a motion component
 */
export function isMotionComponent(component: any): boolean {
	if (!component) return false;

	// Check for motion component markers
	return (
		// Check if it has motion-specific props
		component.$$?.props?.isSVG !== undefined ||
		component.$$?.props?.___tag !== undefined ||
		// Check if the component has a visualElement
		component.visualElement !== undefined ||
		// Check for motion component class name patterns
		component.constructor?.name?.includes('Motion') ||
		component.constructor?.name === 'MotionComponent' ||
		// Check for __motionComponent marker (can be added to Motion.svelte)
		component.__motionComponent === true
	);
}

/**
 * Checks if an element has motion-related attributes
 *
 * @param element - The HTMLElement to check
 * @returns true if the element has motion attributes
 */
export function hasMotionAttributes(element: HTMLElement): boolean {
	if (!element) return false;

	return (
		element.hasAttribute('data-motion-pop-id') ||
		element.hasAttribute('data-projection-id') ||
		element.hasAttribute('data-layout-id') ||
		element.classList?.contains('motion-') ||
		false
	);
}

/**
 * Finds motion component children within a container
 *
 * @param container - The container element
 * @returns Array of motion component elements
 */
export function findMotionChildren(container: HTMLElement): HTMLElement[] {
	if (!container) return [];

	const children: HTMLElement[] = [];

	// Check direct children
	for (let i = 0; i < container.children.length; i++) {
		const child = container.children[i] as HTMLElement;
		if (hasMotionAttributes(child)) {
			children.push(child);
		}
	}

	return children;
}
