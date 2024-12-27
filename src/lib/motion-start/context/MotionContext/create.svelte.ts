/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { MotionContext, type MotionContextProps } from '.';
import type { MotionProps } from '../../motion/types';
import { getCurrentTreeVariants } from './utils';
import { useContext } from '../utils/context';

export function useCreateMotionContext<Instance>(props: MotionProps): MotionContextProps<Instance> {
	const { initial, animate } = $derived(getCurrentTreeVariants(props, useContext(MotionContext)));

	const memo = $derived((_initial: string | false | undefined, _animate: string | false | undefined) => ({
		initial,
		animate,
	}));

	return memo(variantLabelsAsDependency(initial), variantLabelsAsDependency(animate));
}

function variantLabelsAsDependency(prop: undefined | string | string[] | false) {
	return Array.isArray(prop) ? prop.join(' ') : prop;
}
