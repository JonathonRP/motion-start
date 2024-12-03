/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { color } from '../../../value/types/color';
import { filter } from '../../../value/types/complex/filter';
import { numberValueTypes } from './number';
import type { ValueTypeMap } from './types';

/**
 * A map of default value types for common values
 */
export const defaultValueTypes: ValueTypeMap = {
	...numberValueTypes,

	// Color props
	color,
	backgroundColor: color,
	outlineColor: color,
	fill: color,
	stroke: color,

	// Border props
	borderColor: color,
	borderTopColor: color,
	borderRightColor: color,
	borderBottomColor: color,
	borderLeftColor: color,
	filter,
	WebkitFilter: filter,
};

/**
 * Gets the default ValueType for the provided value key
 */
export const getDefaultValueType = (key: string) => defaultValueTypes[key];
