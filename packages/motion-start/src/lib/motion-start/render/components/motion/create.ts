/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { animations } from '../../../motion/features/animations.js';
import { drag } from '../../../motion/features/drag.js';
import { gestureAnimations } from '../../../motion/features/gestures.js';
import { layout } from '../../../motion/features/layout.js';
import { createMotionComponentFactory } from '../create-factory.js';
import { createDomVisualElement } from '../../dom/create-visual-element.js';

export const createMotionComponent = /*@__PURE__*/ createMotionComponentFactory(
	{
		...animations,
		...gestureAnimations,
		...drag,
		...layout,
	},
	createDomVisualElement
);
