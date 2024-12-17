/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionValue } from '../../../value/index.svelte';
import { GroupPlaybackControls } from '../../GroupPlaybackControls.svelte';
import { createAnimationsFromSequence } from '../../sequence/create.svelte';
import type { AnimationSequence, SequenceOptions } from '../../sequence/types.svelte';
import type { AnimationPlaybackControls, ElementOrSelector } from '../../types';
import { animateElements } from './animate-elements.svelte';

export function animateSequence(definition: AnimationSequence, options?: SequenceOptions) {
	const animations: AnimationPlaybackControls[] = [];

	createAnimationsFromSequence(definition, options).forEach(
		({ keyframes, transition }, element: Element | MotionValue) => {
			animations.push(...animateElements(element as ElementOrSelector, keyframes, transition));
		}
	);

	return new GroupPlaybackControls(animations);
}
