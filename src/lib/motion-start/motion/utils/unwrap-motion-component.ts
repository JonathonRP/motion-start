/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Component } from 'svelte';
import { isMotionComponent } from './is-motion-component';
import { motionComponentSymbol } from './symbol';

/**
 * Unwraps a `motion` component and returns either a string for `motion.div` or
 * the React component for `motion(Component)`.
 *
 * If the component is not a `motion` component it returns undefined.
 */
export function unwrapMotionComponent(component: Component | string): Component | string | undefined {
	if (isMotionComponent(component)) {
		return component[motionComponentSymbol as keyof typeof component];
	}

	return undefined;
}
