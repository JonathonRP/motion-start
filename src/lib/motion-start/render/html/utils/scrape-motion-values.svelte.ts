/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionProps, MotionStyle } from '../../../motion/types';
import { isForcedMotionValue } from '../../../motion/utils/is-forced-motion-value';
import { isMotionValue } from '../../../value/utils/is-motion-value';
import type { VisualElement } from '../../VisualElement.svelte';

export function scrapeMotionValuesFromProps<I>(
	props: MotionProps,
	prevProps: MotionProps,
	visualElement?: VisualElement<I>
) {
	const { style } = props;
	const newValues: { [key: string]: any } = {};

	for (const key in style) {
		if (
			isMotionValue(style[key as keyof MotionStyle]) ||
			(prevProps?.style && isMotionValue(prevProps?.style[key as keyof MotionStyle])) ||
			isForcedMotionValue(key, props) ||
			visualElement?.getValue(key)?.liveStyle !== undefined
		) {
			newValues[key] = style[key as keyof MotionStyle];
		}
	}

	return newValues;
}
