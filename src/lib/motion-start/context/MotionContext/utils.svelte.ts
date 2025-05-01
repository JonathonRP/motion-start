/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionContext } from '.';
import type { MotionProps } from '../../motion/types';
import { isVariantLabel } from '../../render/utils/is-variant-label';
import { isControllingVariants } from '../../render/utils/is-controlling-variants';

export function getCurrentTreeVariants(props: () => MotionProps, context: () => MotionContext): () => MotionContext {
	if (isControllingVariants(props)) {
		const { initial, animate } = $derived.by(props);
		return () => ({
			initial: initial === false || isVariantLabel(initial) ? (initial as any) : undefined,
			animate: isVariantLabel(animate) ? animate : undefined,
		});
	}

	return () => (props().inherit !== false ? context : {});
}
