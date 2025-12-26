/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { FeatureComponents } from './types';

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import UseFocusGesture from '../../gestures/focus/UseFocusGesture.svelte';
import UseHoverGesture from '../../gestures/hover/UseHoverGesture.svelte';
import UseTapGesture from '../../gestures/press/UseTapGesture.svelte';

/**
 * @public
 */
const gestureAnimations: FeatureComponents = {
	tap: UseTapGesture,
	focus: UseFocusGesture,
	hover: UseHoverGesture,
};

export { gestureAnimations };
