/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { rootProjectionNode } from './node/HTMLProjectionNode';

export function useInstantLayoutTransition(): (cb?: (() => void) | undefined) => void {
	return startTransition;
}

function startTransition(callback?: () => void) {
	if (!rootProjectionNode.current) return;
	rootProjectionNode.current.isUpdating = false;
	rootProjectionNode.current.blockUpdate();
	callback && callback();
}
