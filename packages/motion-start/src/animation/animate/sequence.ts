/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { spring } from '../generators/spring/index.js';
import { createAnimationsFromSequence } from '../sequence/create.js';
import type { AnimationSequence, SequenceOptions } from '../sequence/types.js';
import type { AnimationPlaybackControls, AnimationScope } from '../types.js';
import { animateSubject } from './subject.js';

export function animateSequence(sequence: AnimationSequence, options?: SequenceOptions, scope?: AnimationScope) {
	const animations: AnimationPlaybackControls[] = [];

	const animationDefinitions = createAnimationsFromSequence(sequence, options, scope, { spring });

	animationDefinitions.forEach(({ keyframes, transition }, subject) => {
		animations.push(...animateSubject(subject, keyframes, transition));
	});

	return animations;
}
