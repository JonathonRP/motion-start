/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { animations } from '../../motion/features/animations';
import type { FeatureBundle } from '../../motion/features/types';
import { createDomVisualElement } from './create-visual-element';

/**
 * @public
 */
export const domMin: FeatureBundle = {
	renderer: createDomVisualElement,
	...animations,
};
