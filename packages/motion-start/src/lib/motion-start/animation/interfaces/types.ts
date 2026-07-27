/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { AnimationType } from '../../render/utils/types.js';
import type { Transition } from '../../types.js';

export type VisualElementAnimationOptions = {
	delay?: number;
	transitionOverride?: Transition;
	custom?: any;
	type?: AnimationType;
};
