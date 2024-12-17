/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionValue } from '../index.svelte';
import { isCustomValue } from '../../utils/resolve-value.js';
import type { CustomValueType } from '../../types';
import { isMotionValue } from './is-motion-value.js';

/**
 * If the provided value is a MotionValue, this returns the actual value, otherwise just the value itself
 *
 * TODO: Remove and move to library
 *
 * @internal
 */
function resolveMotionValue(value?: string | number | CustomValueType | MotionValue): string | number {
	const unwrappedValue = isMotionValue(value) ? value.get() : value;
	return isCustomValue(unwrappedValue) ? unwrappedValue.toValue() : unwrappedValue;
}

export { resolveMotionValue };
