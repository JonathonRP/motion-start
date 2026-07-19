/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { complex } from '../../../value/types/complex/index.js';
import { filter } from '../../../value/types/complex/filter.js';
import { getDefaultValueType } from './defaults.js';

export function getAnimatableNone(key: string, value: string) {
	let defaultValueType = getDefaultValueType(key);
	if (defaultValueType !== filter) defaultValueType = complex;
	// If value is not recognised as animatable, ie "none", create an animatable version origin based on the target
	return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : undefined;
}
