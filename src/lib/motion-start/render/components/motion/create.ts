/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { animations } from '../../../motion/features/animations';
import { drag } from '../../../motion/features/drag';
import { gestureAnimations } from '../../../motion/features/gestures';
import { layout } from '../../../motion/features/layout';
import { createMotionComponentFactory } from '../create-factory';
import { createDomVisualElement } from '../../dom/create-visual-element';

export const createMotionComponent = /*@__PURE__*/ createMotionComponentFactory(
	{
		...animations,
		...gestureAnimations,
		...drag,
		...layout,
	},
	createDomVisualElement
);