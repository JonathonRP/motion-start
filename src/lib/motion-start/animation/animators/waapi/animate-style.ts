/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { GroupPlaybackControls } from '../../GroupPlaybackControls.js';
import type { AnimationScope, DOMKeyframesDefinition, DynamicAnimationOptions, ElementOrSelector } from '../../types.js';
import { animateElements } from './animate-elements.js';

export const createScopedWaapiAnimate = (scope?: AnimationScope) => {
	function scopedAnimate(
		elementOrSelector: ElementOrSelector,
		keyframes: DOMKeyframesDefinition,
		options?: DynamicAnimationOptions
	) {
		return new GroupPlaybackControls(
			animateElements(elementOrSelector, keyframes as DOMKeyframesDefinition, options, scope)
		);
	}

	return scopedAnimate;
};

export const animateMini = /*@__PURE__*/ createScopedWaapiAnimate();
