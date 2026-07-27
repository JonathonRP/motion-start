/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionValue } from '../../../value/index.js';
import { GroupPlaybackControls } from '../../GroupPlaybackControls.js';
import { createAnimationsFromSequence } from '../../sequence/create.js';
import type { AnimationSequence, SequenceOptions } from '../../sequence/types.js';
import type { AnimationPlaybackControls, ElementOrSelector } from '../../types.js';
import { animateElements } from './animate-elements.js';

export function animateSequence(definition: AnimationSequence, options?: SequenceOptions) {
	const animations: AnimationPlaybackControls[] = [];

	createAnimationsFromSequence(definition, options).forEach(
		({ keyframes, transition }, element: Element | MotionValue) => {
			animations.push(...animateElements(element as ElementOrSelector, keyframes, transition));
		}
	);

	return new GroupPlaybackControls(animations);
}
