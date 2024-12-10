/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { DragGesture } from '../../gestures/drag';
import { PanGesture } from '../../gestures/pan';
import { HTMLProjectionNode } from '../../projection/node/HTMLProjectionNode';
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
