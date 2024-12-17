/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { HoverGesture } from '../../gestures/hover.svelte';
import { FocusGesture } from '../../gestures/focus.svelte';
import { PressGesture } from '../../gestures/press.svelte';
import { InViewFeature } from './viewport/index.svelte';
import type { FeaturePackages } from './types';

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
