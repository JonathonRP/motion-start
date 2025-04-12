/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionProps } from '../../../motion/types';
import { isMotionValue } from '../../../value/utils/is-motion-value';
import type { VisualElement } from '../../VisualElement.svelte';
import { scrapeMotionValuesFromProps as scrapeHTMLMotionValuesFromProps } from '../../html/utils/scrape-motion-values';
import { transformPropOrder } from '../../html/utils/transform';

export function scrapeMotionValuesFromProps<I>(
	props: MotionProps,
	prevProps: MotionProps,
	visualElement?: VisualElement<I>
) {
	const newValues = scrapeHTMLMotionValuesFromProps(props, prevProps, visualElement);

	for (const key in props) {
		if (isMotionValue(props[key as keyof typeof props]) || isMotionValue(prevProps[key as keyof typeof prevProps])) {
			const targetKey =
				transformPropOrder.indexOf(key) !== -1 ? 'attr' + key.charAt(0).toUpperCase() + key.substring(1) : key;

			newValues[targetKey] = props[key as keyof typeof props];
		}
	}

	return newValues;
}
