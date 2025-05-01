/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { MotionContext } from '.';
import type { MotionProps } from '../../motion/types';
import { getCurrentTreeVariants } from './utils.svelte';
import { useContext } from '../use';

export function useCreateMotionContext<Instance>(props: () => MotionProps): () => MotionContext<Instance> {
	const { initial, animate } = $derived.by(getCurrentTreeVariants(props, () => useContext(MotionContext).current));

	const context = (_initial: () => string | false | undefined, _animate: () => string | false | undefined) => ({
		initial,
		animate,
	});

	const motionContext = $derived(
		context(
			() => variantLabelsAsDependency(initial),
			() => variantLabelsAsDependency(animate)
		)
	);

	return () => motionContext;
}

function variantLabelsAsDependency(prop: undefined | string | string[] | false) {
	return Array.isArray(prop) ? prop.join(' ') : prop;
}
