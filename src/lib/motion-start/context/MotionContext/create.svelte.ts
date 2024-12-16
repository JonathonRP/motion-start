/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { fromStore } from 'svelte/store';
import { MotionContext, type MotionContextProps } from '.';
import type { MotionProps } from '../../motion/types';
import { getCurrentTreeVariants } from './utils';
import { useContext } from '../utils/context.svelte';

export function useCreateMotionContext<Instance>(props: MotionProps): MotionContextProps<Instance> {
	const motionContext = fromStore(useContext(MotionContext));

	return {
		initial: getCurrentTreeVariants(props, motionContext.current).initial,
		animate: getCurrentTreeVariants(props, motionContext.current).animate,
	};
}

function variantLabelsAsDependency(prop: undefined | string | string[] | false) {
	return Array.isArray(prop) ? prop.join(' ') : prop;
}
