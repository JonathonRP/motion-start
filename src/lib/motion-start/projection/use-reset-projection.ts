/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { rootProjectionNode } from './node/HTMLProjectionNode';

export function useResetProjection() {
	const reset = $derived(() => {
		const root = rootProjectionNode.current;
		if (!root) return;
		root.resetTree();
	});

	return reset;
}
