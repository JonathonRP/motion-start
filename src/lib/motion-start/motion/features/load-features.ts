/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { featureDefinitions } from './definitions';
import type { FeaturePackages } from './types';

export function loadFeatures(features: FeaturePackages) {
	for (const key in features) {
		featureDefinitions[key as keyof typeof featureDefinitions] = {
			...featureDefinitions[key as keyof typeof featureDefinitions],
			...features[key as keyof typeof features],
		} as any;
	}
}
