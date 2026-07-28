/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { visualElementStore } from '../../render/store.js';
import type { GenericKeyframesTarget, TargetAndTransition } from '../../types.js';
import { invariant } from '../../utils/errors.js';
import type { MotionValue } from '../../value/index.js';
import { isMotionValue } from '../../value/utils/is-motion-value.js';
import { animateTarget } from '../interfaces/visual-element-target.js';
import type { ObjectTarget } from '../sequence/types.js';
import type {
	AnimationPlaybackControls,
	AnimationScope,
	DOMKeyframesDefinition,
	DynamicAnimationOptions,
	ElementOrSelector,
	ValueAnimationTransition,
} from '../types.js';
import { createDOMVisualElement, createObjectVisualElement } from '../utils/create-visual-element.js';
import { isDOMKeyframes } from '../utils/is-dom-keyframes.js';
import { resolveSubjects } from './resolve-subjects.js';
import { animateSingleValue } from './single-value.js';

export type AnimationSubject = Element | MotionValue<any> | any;

function isSingleValue(subject: unknown, keyframes: unknown): subject is MotionValue | string | number {
	return (
		isMotionValue(subject) || typeof subject === 'number' || (typeof subject === 'string' && !isDOMKeyframes(keyframes))
	);
}

/**
 * Animate a string
 */
export function animateSubject(
	value: string | MotionValue<string>,
	keyframes: string | GenericKeyframesTarget<string>,
	options?: ValueAnimationTransition<string>
): AnimationPlaybackControls[];
/**
 * Animate a number
 */
export function animateSubject(
	value: number | MotionValue<number>,
	keyframes: number | GenericKeyframesTarget<number>,
	options?: ValueAnimationTransition<number>
): AnimationPlaybackControls[];
/**
 * Animate a Element
 */
export function animateSubject(
	element: ElementOrSelector,
	keyframes: DOMKeyframesDefinition,
	options?: DynamicAnimationOptions,
	scope?: AnimationScope
): AnimationPlaybackControls[];
/**
 * Animate a object
 */
export function animateSubject<O extends Object>(
	object: O | O[],
	keyframes: ObjectTarget<O>,
	options?: DynamicAnimationOptions
): AnimationPlaybackControls[];
/**
 * Implementation
 */
export function animateSubject<O extends Object>(
	subject: MotionValue<number> | MotionValue<string> | number | string | ElementOrSelector | O | O[],
	keyframes:
		| number
		| string
		| GenericKeyframesTarget<number>
		| GenericKeyframesTarget<string>
		| DOMKeyframesDefinition
		| ObjectTarget<O>,
	options?: ValueAnimationTransition<number> | ValueAnimationTransition<string> | DynamicAnimationOptions,
	scope?: AnimationScope
): AnimationPlaybackControls[] {
	const animations: AnimationPlaybackControls[] = [];

	if (isSingleValue(subject, keyframes)) {
		animations.push(
			animateSingleValue(
				subject,
				isDOMKeyframes(keyframes) ? (keyframes as any).default || keyframes : keyframes,
				options ? (options as any).default || options : options
			)
		);
	} else {
		const subjects = resolveSubjects(subject, keyframes as DOMKeyframesDefinition, scope);

		const numSubjects = subjects.length;

		invariant(Boolean(numSubjects), 'No valid elements provided.');

		for (let i = 0; i < numSubjects; i++) {
			const thisSubject = subjects[i];

			const createVisualElement = thisSubject instanceof Element ? createDOMVisualElement : createObjectVisualElement;

			if (!visualElementStore.has(thisSubject)) {
				createVisualElement(thisSubject as any);
			}

			const visualElement = visualElementStore.get(thisSubject)!;

			const transition = { ...options };

			/**
			 * Resolve stagger function if provided.
			 */
			if ('delay' in transition && typeof transition.delay === 'function') {
				transition.delay = transition.delay(i, numSubjects);
			}

			animations.push(...animateTarget(visualElement, { ...(keyframes as {}), transition } as TargetAndTransition, {}));
		}
	}

	return animations;
}
