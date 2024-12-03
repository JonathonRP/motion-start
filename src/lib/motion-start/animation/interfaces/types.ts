/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { AnimationType } from '../../render/utils/types';
import type { Transition } from '../../types';

export type VisualElementAnimationOptions = {
	delay?: number;
	transitionOverride?: Transition;
	custom?: any;
	type?: AnimationType;
};
