/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { FeatureComponents } from "./types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

import AnimationState from './AnimationState.svelte';
import Exit from './Exit.svelte';
/**
 * @public
 */
const animations = {
    animation: AnimationState,
    exit:Exit
} satisfies FeatureComponents
export { animations };
