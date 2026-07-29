/**
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import type { Box } from '../../geometry/types.js';
import { createProjectionNode } from '../create-projection-node.svelte.js';
import type { IProjectionNode, ProjectionNodeOptions } from '../types.js';

let rootNode: IProjectionNode<Window>;

export const TestRootNode = createProjectionNode<Window>({
	measureScroll: (_instance) => ({ x: 0, y: 0 }),
	checkIsScrollRoot: () => true,
});

interface TestInstance {
	resetTransform?: () => void;
	box?: Box;
	isConnected?: boolean;
}

export const TestProjectionNode = createProjectionNode<TestInstance>({
	measureScroll: (_instance) => ({ x: 0, y: 0 }),
	defaultParent: () => {
		if (!rootNode) {
			rootNode = new TestRootNode() as IProjectionNode<Window>;
		}

		return rootNode;
	},
	resetTransform: (instance) => (instance.resetTransform ? instance.resetTransform() : undefined),
	checkIsScrollRoot: () => false,
});

export function createTestNode(parent?: any, options?: ProjectionNodeOptions, latestValues: any = {}) {
	const testNode = new TestProjectionNode(latestValues, parent);
	testNode.setOptions({
		...options,
	});
	return testNode;
}
