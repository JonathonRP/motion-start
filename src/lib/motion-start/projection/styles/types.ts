/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { IProjectionNode } from '../node/types';

export type ScaleCorrector = (latest: string | number, node: IProjectionNode) => string | number;

export interface ScaleCorrectorDefinition {
	correct: ScaleCorrector;
	applyTo?: string[];
}

export interface ScaleCorrectorMap {
	[key: string]: ScaleCorrectorDefinition;
}
