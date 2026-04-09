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
	// Explicit listener removers let features detach individual event bindings
	// even before the AbortController is torn down on full unmount.
	private _removeListeners = new Set<VoidFunction>();

	constructor(node: VisualElement<I>) {
		this.node = node;
	}

	/** Register a feature event listener as a Svelte attachment on the element. */
	protected listen(event: string, handler: (e: Event) => void): () => void;
	// @ts-expect-error
	protected listen(event: string, handler: (e: KeyboardEvent) => void): () => void;
	protected listen(event: string, handler: (e: MouseEvent) => void): () => void;
	protected listen(event: string, handler: (e: PointerEvent) => void): () => void;
	protected listen(event: string, handler: (e: Event | MouseEvent | KeyboardEvent | PointerEvent) => void) {
		this._controller ??= new AbortController();
		const signal = this._controller.signal;
		const key = Symbol(event);
		const node = this.node as VisualElement<unknown>;
		node.listeners[key] = (el) => on(el, event, handler, { signal });

		const removeListener = () => {
			delete node.listeners[key];
		};
		this._removeListeners.add(removeListener);

		// Return a per-listener cleanup so features can stop specific handlers
		// without waiting for the whole feature to unmount.
		return () => {
			if (!this._removeListeners.delete(removeListener)) return;
			removeListener();
		};
	}

	abstract mount(): void;

	unmount(): void {
		// Detach listeners first so no stale DOM events fire while the feature is
		// tearing down its controller-driven attachments.
		this._removeListeners.forEach((removeListener) => removeListener());
		this._removeListeners.clear();
		this._controller?.abort();
		this._controller = null;
	}

	update(): void {}
}
