/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { GroupPlaybackControls } from '../../GroupPlaybackControls';
import { createAnimationsFromSequence } from '../../sequence/create';
import type { AnimationSequence, SequenceOptions } from '../../sequence/types';
import type { AnimationPlaybackControls } from '../../types';
import { animateElements } from './animate-elements';

export function animateSequence(definition: AnimationSequence, options?: SequenceOptions) {
	const animations: AnimationPlaybackControls[] = [];

	createAnimationsFromSequence(definition, options).forEach(({ keyframes, transition }, element: Element) => {
		animations.push(...animateElements(element, keyframes, transition));
	});

	return new GroupPlaybackControls(animations);
}
