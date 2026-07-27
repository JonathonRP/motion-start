import type { Component } from 'svelte';
import { motionComponentSymbol } from './symbol.js';

type MotionComponent = Component & {
	[motionComponentSymbol]: Component | string;
};

/**
 * Checks if a component is a `motion` component.
 */
export function isMotionComponent(component: Component | string): component is MotionComponent {
	return (
		component !== null &&
		(typeof component === 'object' || typeof component === 'function') &&
		motionComponentSymbol in component
	);
}
