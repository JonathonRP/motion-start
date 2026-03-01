/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { type MotionContext, useMotionContext } from '.';
import type { MotionProps } from '../../motion/types';
import { getCurrentTreeVariants } from './utils.svelte';

export function useCreateMotionContext<Instance>(props: () => MotionProps): () => MotionContext<Instance> {
	const { initial, animate } = $derived(getCurrentTreeVariants(props, useMotionContext().current));

	const context = (_initial: string | false | undefined, _animate: string | false | undefined) => ({
		initial,
		animate,
	});

	const motionContext = $derived.by(() => context(variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)));

	return () => motionContext;
}

function variantLabelsAsDependency(prop: undefined | string | string[] | false) {
	return Array.isArray(prop) ? prop.join(' ') : prop;
}
