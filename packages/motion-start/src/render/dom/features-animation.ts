/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { animations } from '../../motion/features/animations.js';
import { gestureAnimations } from '../../motion/features/gestures.js';
import type { FeatureBundle } from '../../motion/features/types.js';
import { createDomVisualElement } from './create-visual-element.js';

/**
 * @public
 */
export const domAnimation: FeatureBundle = {
	renderer: createDomVisualElement,
	...animations,
	...gestureAnimations,
};
