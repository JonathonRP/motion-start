/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { frame } from '../frameloop';
import { tick } from 'svelte';

export function useForceUpdate(): [VoidFunction, number] {
	let isMounted = false;
	const forcedRenderCount = 0;
	$effect.pre(() => {
		isMounted = true;

		return () => {
			isMounted = false;
		};
	});

	const _forceRender = (_forcedRenderCount: number) => () => {
		isMounted && _forcedRenderCount++;
	};

	/**
	 * Defer this to the end of the next animation frame in case there are multiple
	 * synchronous calls.
	 */
	const _deferredForceRender = (__forceRender: () => void) => () => frame.postRender(__forceRender);

	let forceRender = _forceRender(forcedRenderCount);
	let deferredForceRender = _deferredForceRender(forceRender);

	tick().then(() => {
		forceRender = _forceRender(forcedRenderCount);
		deferredForceRender = _deferredForceRender(forceRender);
	});

	return [deferredForceRender, forcedRenderCount];
}
