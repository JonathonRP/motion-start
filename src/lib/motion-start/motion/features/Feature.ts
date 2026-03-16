/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { on } from 'svelte/events';
import type { VisualElement } from '../../render/VisualElement.svelte';

export abstract class Feature<I> {
	isMounted = false;

	node: VisualElement<I>;

	private _controller: AbortController | null = null;

	constructor(node: VisualElement<I>) {
		this.node = node;
	}

	/** Register a feature event listener as a Svelte attachment on the element. */
	protected listen(event: string, handler: (e: Event) => void) {
		this._controller ??= new AbortController();
		const signal = this._controller.signal;
		const key = Symbol(event);
		(this.node as VisualElement<unknown>).listeners[key] = (el) =>
			on(el, event, handler, { signal });
	}

	abstract mount(): void;

	unmount(): void {
		this._controller?.abort();
		this._controller = null;
	}

	update(): void {}
}
