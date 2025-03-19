/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { invariant } from '../../utils/errors';
import { setTarget } from '../../render/utils/setters';
import type { VisualElement } from '../../render/VisualElement';
import type { AnimationControls, AnimationDefinition } from '../types';
import { animateVisualElement } from '../interfaces/visual-element';

function stopAnimation(visualElement: VisualElement<unknown>) {
	visualElement.values.forEach((value) => value.stop());
}

function setVariants(visualElement: VisualElement<unknown>, variantLabels: string[]) {
	const reversedLabels = [...variantLabels].reverse();

	reversedLabels.forEach((key) => {
		const variant = visualElement.getVariant(key);
		variant && setTarget(visualElement, variant);

		if (visualElement.variantChildren) {
			visualElement.variantChildren.forEach((child) => {
				setVariants(child, variantLabels);
			});
		}
	});
}

export function setValues(visualElement: VisualElement<unknown>, definition: AnimationDefinition) {
	if (Array.isArray(definition)) {
		return setVariants(visualElement, definition);
	} else if (typeof definition === 'string') {
		return setVariants(visualElement, [definition]);
	} else {
		setTarget(visualElement, definition as any);
	}
}

/**
 * @public
 */
export function animationControls(): AnimationControls {
	/**
	 * Track whether the host component has mounted.
	 */
	let hasMounted = false;

	/**
	 * A collection of linked component animation controls.
	 */
	const subscribers = new Set<VisualElement<unknown>>();

	const controls: AnimationControls = {
		subscribe(visualElement) {
			subscribers.add(visualElement);
			return () => void subscribers.delete(visualElement);
		},

		start(definition, transitionOverride) {
			invariant(
				hasMounted,
				'controls.start() should only be called after a component has mounted. Consider calling within a useEffect hook.'
			);

			const animations: Array<Promise<any>> = [];
			subscribers.forEach((visualElement) => {
				animations.push(
					animateVisualElement(visualElement, definition, {
						transitionOverride,
					})
				);
			});

			return Promise.all(animations);
		},

		set(definition) {
			invariant(
				hasMounted,
				'controls.set() should only be called after a component has mounted. Consider calling within a useEffect hook.'
			);

			return subscribers.forEach((visualElement) => {
				setValues(visualElement, definition);
			});
		},

		stop() {
			subscribers.forEach((visualElement) => {
				stopAnimation(visualElement);
			});
		},

		mount() {
			hasMounted = true;

			return () => {
				hasMounted = false;
				controls.stop();
			};
		},
	};

	return controls;
}
