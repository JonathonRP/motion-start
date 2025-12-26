/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { FeatureComponents } from './types';

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { UseFocusGesture } from '../../gestures/focus/index.js';
import { UseHoverGesture } from '../../gestures/hover/index.js';
import { UseTapGesture } from '../../gestures/press/index.js';

/**
 * @public
 */
const gestureAnimations: FeatureComponents = {
	tap: UseTapGesture,
	focus: UseFocusGesture,
	hover: UseHoverGesture,
};

export { gestureAnimations };
