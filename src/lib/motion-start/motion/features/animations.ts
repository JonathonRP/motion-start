/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { AnimationFeature } from './animation';
import { ExitAnimationFeature } from './animation/exit';
import type { FeaturePackages } from './types';

export const animations: FeaturePackages = {
	animation: {
		Feature: AnimationFeature,
	},
	exit: {
		Feature: ExitAnimationFeature,
	},
};
