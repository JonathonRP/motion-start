/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { isAnimationControls } from '../../animation/utils/is-animation-controls';
import type { MotionProps } from '../../motion/types';
import { isVariantLabel } from './is-variant-label';
import { variantProps } from './variant-props';

export function isControllingVariants(props: MotionProps) {
	return (
		isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name as keyof typeof props]))
	);
}

export function isVariantNode(props: MotionProps) {
	return Boolean(isControllingVariants(props) || props.variants);
}
