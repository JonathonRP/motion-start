/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { animations } from '../../../motion/features/animations.svelte';
import { drag } from '../../../motion/features/drag.svelte';
import { gestureAnimations } from '../../../motion/features/gestures.svelte';
import { layout } from '../../../motion/features/layout.svelte';
import { createMotionComponentFactory } from '../create-factory';
import { createDomVisualElement } from '../../dom/create-visual-element.svelte';

export const createMotionComponent = /*@__PURE__*/ createMotionComponentFactory(
	{
		...animations,
		...gestureAnimations,
		...drag,
		...layout,
	},
	createDomVisualElement
);
