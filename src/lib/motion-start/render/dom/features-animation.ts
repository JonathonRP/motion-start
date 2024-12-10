/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { animations } from '../../motion/features/animations';
import { gestureAnimations } from '../../motion/features/gestures';
import type { FeatureBundle } from '../../motion/features/types';
import { createDomVisualElement } from './create-visual-element';

/**
 * @public
 */
export const domAnimation: FeatureBundle = {
	renderer: createDomVisualElement,
	...animations,
	...gestureAnimations,
};