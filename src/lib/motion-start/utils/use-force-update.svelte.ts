/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { frame } from '../frameloop';
import { tick } from 'svelte';

export function useForceUpdate(): [VoidFunction, number] {
	let isMounted = $state(false);
	let forcedRenderCount = $state(0);
	$effect.pre(() => {
		isMounted = true;

		return () => {
			isMounted = false;
		};
	});

	const forceRender = $derived(() => {
		isMounted && forcedRenderCount++;
	});

	/**
	 * Defer this to the end of the next animation frame in case there are multiple
	 * synchronous calls.
	 */
	const deferredForceRender = $derived(() => frame.postRender(forceRender));

	// tick().then(() => {
	// 	forceRender = _forceRender(forcedRenderCount);
	// 	deferredForceRender = _deferredForceRender(forceRender);
	// });

	return [deferredForceRender, forcedRenderCount];
}
