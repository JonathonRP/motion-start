import { getContext, tick } from 'svelte';
import { get, type Writable } from 'svelte/store';
import { MotionContext, type MotionContextProps } from '.';
import type { MotionProps } from '../../motion/types';
import { getCurrentTreeVariants } from './utils';

export function useCreateMotionContext<Instance>(props: MotionProps, isCustom = false): MotionContextProps<Instance> {
	const mc = () => get(getContext<Writable<MotionContextProps<Instance>>>(MotionContext) || MotionContext(isCustom));

	let { initial, animate } = getCurrentTreeVariants(props, mc());
	tick().then(() => ({ initial, animate } = getCurrentTreeVariants(props, mc())));

	const memo = (_initial: string | boolean | undefined, _animate: string | boolean | undefined) => ({
		initial,
		animate,
	});

	let value = memo(variantLabelsAsDependency(initial), variantLabelsAsDependency(animate));
	tick().then(() => (value = memo(variantLabelsAsDependency(initial), variantLabelsAsDependency(animate))));

	return value;
}

function variantLabelsAsDependency(prop: undefined | string | string[] | boolean) {
	return Array.isArray(prop) ? prop.join(' ') : prop;
}
