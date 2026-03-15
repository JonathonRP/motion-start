/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../../render/VisualElement.svelte';

export abstract class Feature<I> {
	isMounted = false;

	node: VisualElement<I>;

	constructor(node: VisualElement<I>) {
		this.node = node;
	}

	/**
	 * Register a DOM event handler for this feature.
	 * If multiple features register the same event name, both handlers fire.
	 */
	protected registerHandler(eventName: string, handler: (event: Event) => void) {
		(this.node as VisualElement<unknown>).addFeatureHandler(this, eventName, handler);
	}

	protected removeHandler(eventName: string) {
		(this.node as VisualElement<unknown>).removeFeatureHandler(this, eventName);
	}

	abstract mount(): void;

	abstract unmount(): void;

	update(): void {}
}
