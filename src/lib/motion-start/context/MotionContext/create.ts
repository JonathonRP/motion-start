/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

import { afterUpdate, getContext, onMount, tick } from 'svelte';
import { get, type Writable } from 'svelte/store';
import { MotionContext, type MotionContextProps } from '.';
import type { MotionProps } from '../../motion/types';
import { getCurrentTreeVariants } from './utils';

export function useCreateMotionContext<Instance>(props: MotionProps, isCustom = false): MotionContextProps<Instance> {
	const mc = () => get(getContext<Writable<MotionContextProps<Instance>>>(MotionContext) || MotionContext(isCustom));

	let { initial, animate } = getCurrentTreeVariants(props, mc());

	const memo = (_initial: string | boolean | undefined, _animate: string | boolean | undefined) => ({
		initial,
		animate,
	});

	let value = memo(variantLabelsAsDependency(initial), variantLabelsAsDependency(animate));

	afterUpdate(() => {
		({ initial, animate } = getCurrentTreeVariants(props, mc()));
		value = memo(variantLabelsAsDependency(initial), variantLabelsAsDependency(animate));
	});

	return value;
}

function variantLabelsAsDependency(prop: undefined | string | string[] | boolean) {
	return Array.isArray(prop) ? prop.join(' ') : prop;
}
