/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { FeatureComponents } from './types';
/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import AnimationState from './AnimationState.svelte';
import Exit from './Exit.svelte';

/**
 * @public
 */
const animations: FeatureComponents = {
	animation: AnimationState,
	exit: Exit,
};

export { animations };
