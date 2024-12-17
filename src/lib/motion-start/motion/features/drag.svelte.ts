/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { DragGesture } from '../../gestures/drag/index.svelte';
import { PanGesture } from '../../gestures/pan/index.svelte';
import { HTMLProjectionNode } from '../../projection/node/HTMLProjectionNode.svelte';
import { MeasureLayout } from './layout/MeasureLayout.svelte';
import type { FeaturePackages } from './types';

export const drag: FeaturePackages = {
	pan: {
		Feature: PanGesture,
	},
	drag: {
		Feature: DragGesture,
		ProjectionNode: HTMLProjectionNode,
		MeasureLayout,
	},
};
