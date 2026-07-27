/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { HoverGesture } from '../../gestures/hover.js';
import { FocusGesture } from '../../gestures/focus.js';
import { PressGesture } from '../../gestures/press.js';
import { InViewFeature } from './viewport/index.js';
import type { FeaturePackages } from './types.js';

export const gestureAnimations: FeaturePackages = {
	inView: {
		Feature: InViewFeature,
	},
	tap: {
		Feature: PressGesture,
	},
	focus: {
		Feature: FocusGesture,
	},
	hover: {
		Feature: HoverGesture,
	},
};
