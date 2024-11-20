/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { IProjectionNode } from './types';

const notify = (node: IProjectionNode<unknown>) => !node.isLayoutDirty && node.willUpdate(false);

export interface NodeGroup {
	add: (node: IProjectionNode<unknown>) => void;
	remove: (node: IProjectionNode<unknown>) => void;
	dirty: VoidFunction;
}

export function nodeGroup(): NodeGroup {
	const nodes = new Set<IProjectionNode<unknown>>();
	const subscriptions = new WeakMap<IProjectionNode<unknown>, () => void>();

	const dirtyAll = () => nodes.forEach(notify);

	return {
		add: (node) => {
			nodes.add(node);
			subscriptions.set(node, node.addEventListener('willUpdate', dirtyAll));
		},
		remove: (node) => {
			nodes.delete(node);
			const unsubscribe = subscriptions.get(node);
			if (unsubscribe) {
				unsubscribe();
				subscriptions.delete(node);
			}
			dirtyAll();
		},
		dirty: dirtyAll,
	};
}
