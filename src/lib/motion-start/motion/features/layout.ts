/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { HTMLProjectionNode } from '../../projection/node/HTMLProjectionNode.js';
import MeasureLayout from './layout/MeasureLayout.svelte';
import type { FeaturePackages } from './types.js';

export const layout: FeaturePackages = {
	layout: {
		ProjectionNode: HTMLProjectionNode,
		MeasureLayout,
	},
};
