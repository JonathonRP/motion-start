/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { fromStore } from 'svelte/store';
import { MotionContext, type MotionContextProps } from '.';
import type { MotionProps } from '../../motion/types';
import { getCurrentTreeVariants } from './utils';
import { useContext } from '../utils/context.svelte';

export function useCreateMotionContext<Instance>(props: MotionProps, isCustom = false): MotionContextProps<Instance> {
	const { initial, animate } = $state(
		getCurrentTreeVariants(props, fromStore(useContext(MotionContext, isCustom)).current)
	);

	const memo = $derived.by(() => (_initial: string | false | undefined, _animate: string | false | undefined) => ({
		initial,
		animate,
	}));

	return memo(variantLabelsAsDependency(initial), variantLabelsAsDependency(animate));
}

function variantLabelsAsDependency(prop: undefined | string | string[] | false) {
	return Array.isArray(prop) ? prop.join(' ') : prop;
}
