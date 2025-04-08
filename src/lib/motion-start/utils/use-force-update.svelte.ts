/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { IsMounted } from 'runed';
import { frame } from '../frameloop';

export function useForceUpdate(): [VoidFunction, number] {
	const isMounted = new IsMounted();
	let forcedRenderCount = $state(0);

	const forceRender = () => {
		isMounted.current && forcedRenderCount++;
	};

	/**
	 * Defer this to the end of the next animation frame in case there are multiple
	 * synchronous calls.
	 */
	const deferredForceRender = () => frame.postRender(forceRender);

	// tick().then(() => {
	// 	forceRender = _forceRender(forcedRenderCount);
	// 	deferredForceRender = _deferredForceRender(forceRender);
	// });

	return [deferredForceRender, forcedRenderCount];
}
