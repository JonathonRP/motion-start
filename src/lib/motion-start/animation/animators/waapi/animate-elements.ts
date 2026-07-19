/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { resolveElements } from '../../../render/dom/utils/resolve-element.js';
import { invariant } from '../../../utils/errors.js';
import { secondsToMilliseconds } from '../../../utils/time-conversion.js';
import type {
	AnimationPlaybackControls,
	AnimationScope,
	DOMKeyframesDefinition,
	DynamicAnimationOptions,
	ElementOrSelector,
} from '../../types.js';
import { getValueTransition } from '../../utils/get-value-transition.js';
import { NativeAnimation } from './NativeAnimation.js';

export function animateElements(
	elementOrSelector: ElementOrSelector,
	keyframes: DOMKeyframesDefinition,
	options?: DynamicAnimationOptions,
	scope?: AnimationScope
) {
	const elements = resolveElements(elementOrSelector, scope);
	const numElements = elements.length;

	invariant(Boolean(numElements), 'No valid element provided.');

	const animations: AnimationPlaybackControls[] = [];

	for (let i = 0; i < numElements; i++) {
		const element = elements[i];
		const elementTransition = {
			...options,
			delay: typeof options?.delay === 'function' ? options.delay(i, numElements) : options?.delay,
		};

		for (const valueName in keyframes) {
			const valueKeyframes = keyframes[valueName as keyof typeof keyframes]!;
			const valueOptions = {
				...getValueTransition(elementTransition, valueName),
			};

			valueOptions.duration = valueOptions.duration
				? secondsToMilliseconds(valueOptions.duration)
				: valueOptions.duration;

			valueOptions.delay = secondsToMilliseconds(valueOptions.delay || 0);

			animations.push(new NativeAnimation(element, valueName, valueKeyframes, valueOptions));
		}
	}

	return animations;
}
