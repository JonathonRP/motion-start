/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionProps, MotionStyle } from '../../../motion/types';

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import { isForcedMotionValue } from '../../../motion/utils/is-forced-motion-value.js';
import { isMotionValue } from '../../../value/utils/is-motion-value.js';

function scrapeMotionValuesFromProps(props: MotionProps) {
	var style = props.style as MotionStyle;
	var newValues = {};
	for (var key in style) {
		//@ts-expect-error
		if (isMotionValue(style[key]) || isForcedMotionValue(key, props)) {
			//@ts-expect-error
			newValues[key] = style[key];
		}
	}
	return newValues;
}

export { scrapeMotionValuesFromProps };
