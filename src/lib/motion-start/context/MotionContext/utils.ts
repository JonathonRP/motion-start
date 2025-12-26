/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionProps } from '../../motion/types';
import type { MotionContextProps } from '.';

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { checkIfControllingVariants, isVariantLabel } from '../../render/utils/variants.js';

function getCurrentTreeVariants(props: MotionProps, context: MotionContextProps) {
	if (checkIfControllingVariants(props)) {
		var initial = props.initial,
			animate = props.animate;
		return {
			initial: initial === false || isVariantLabel(initial) ? initial : undefined,
			animate: isVariantLabel(animate) ? animate : undefined,
		};
	}
	return props.inherit !== false ? context || {} : {};
}

export { getCurrentTreeVariants };
