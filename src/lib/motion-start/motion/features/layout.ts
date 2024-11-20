/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { HTMLProjectionNode } from '../../projection/node/HTMLProjectionNode';
import { MeasureLayout } from './layout/MeasureLayout';
import type { FeaturePackages } from './types';

export const layout: FeaturePackages = {
	layout: {
		ProjectionNode: HTMLProjectionNode,
		MeasureLayout,
	},
};
