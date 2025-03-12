/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../../render/VisualElement.svelte';
import { isWillChangeMotionValue } from './is';

export function addValueToWillChange<I>(visualElement: VisualElement<I>, key: string) {
	const willChange = visualElement.getValue('willChange');

	/**
	 * It could be that a user has set willChange to a regular MotionValue,
	 * in which case we can't add the value to it.
	 */
	if (isWillChangeMotionValue(willChange)) {
		return willChange.add(key);
	}
}
