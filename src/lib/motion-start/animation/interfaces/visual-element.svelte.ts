/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { resolveVariant } from '../../render/utils/resolve-dynamic-variants';
import type { VisualElement } from '../../render/VisualElement.svelte';
import type { AnimationDefinition } from '../types';
import type { VisualElementAnimationOptions } from './types';
import { animateTarget } from './visual-element-target.svelte';
import { animateVariant } from './visual-element-variant.svelte';

export function animateVisualElement(
	visualElement: VisualElement<unknown>,
	definition: AnimationDefinition,
	options: VisualElementAnimationOptions = {}
) {
	visualElement.notify('AnimationStart', definition);
	let animation: Promise<any>;

	if (Array.isArray(definition)) {
		const animations = definition.map((variant) => animateVariant(visualElement, variant, options));
		animation = Promise.all(animations);
	} else if (typeof definition === 'string') {
		animation = animateVariant(visualElement, definition, options);
	} else {
		const resolvedDefinition =
			typeof definition === 'function' ? resolveVariant(visualElement, definition, options.custom) : definition;

		animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
	}

	return animation.then(() => {
		visualElement.notify('AnimationComplete', definition);
	});
}
