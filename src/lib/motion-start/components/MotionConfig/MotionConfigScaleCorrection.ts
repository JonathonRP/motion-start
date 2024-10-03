import { getContext } from 'svelte';
import { get, type Writable } from 'svelte/store';
import { ScaleCorrectionContext, ScaleCorrectionParentContext } from '../../context/ScaleCorrectionProvider.svelte';
import type { MotionContextProps } from '$lib/motion-start/context/MotionContext';

export const scaleCorrection = () => {
	const scaleCorrectionContext = getContext<Writable<MotionContextProps>>(ScaleCorrectionContext);
	const scaleCorrectionParentContext = getContext<Writable<unknown[]>>(ScaleCorrectionParentContext);
	const afterU = (nc = false) => {
		/* Second part of the updater calling in child layouts first.*/
		const scc = get(scaleCorrectionContext);
		// @ts-expect-error
		scc.forEach((v: { afterU: (arg0: boolean) => void }, i: any) => {
			v.afterU?.(true);
		});
	};

	const updater = () => {
		// in React the updater function is called on children first, in Svelte the child does not call it.
		// @ts-expect-error
		get(scaleCorrectionContext).forEach((v) => {
			v.updater?.(true);
		});
	};

	scaleCorrectionParentContext.update((v) =>
		v.concat([
			{
				updater,
				afterU,
			},
		])
	);

	return {
		update: updater,
	};
};
