/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { FeatureComponents } from './types';

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import UseDrag from '../../gestures/drag/UseDrag.svelte';
import UsePanGesture from '../../gestures/pan/UsePanGesture.svelte';

/**
 * @public
 */
const drag: FeatureComponents = {
	pan: UsePanGesture,
	drag: UseDrag,
};

export { drag };
