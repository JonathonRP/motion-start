/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../../render/VisualElement';

export abstract class Feature<I> {
	isMounted = false;

	node: VisualElement<I>;

	constructor(node: VisualElement<I>) {
		this.node = node;
	}

	abstract mount(): void;

	abstract unmount(): void;

	update(): void {}
}
