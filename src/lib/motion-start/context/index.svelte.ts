import { nanoid } from 'nanoid/non-secure';
import type { RefObject } from '../utils/safe-react-types';
import { getContext, hasContext, onMount, setContext, untrack } from 'svelte';
import { createSubscriber } from 'svelte/reactivity';
import { fromStore, toStore, writable, type Writable } from 'svelte/store';

export class Context<T> {
	readonly #key: symbol;
	#state = $state<RefObject<T>>({ current: null });

	public constructor(initial: T) {
		this.#key = Symbol(nanoid());
		this.#state = { current: initial };
	}

	#create(): T {
		return setContext(this.#key, this.#state).current!;
	}

	#get(): T {
		return getContext<RefObject<T>>(this.#key).current!;
	}

	pipe(...transformers: ((arg?: T) => T)[]) {
		return [this.#get, ...transformers].reduce<T>(
			(value, fn) => fn.call(this, value),
			(!hasContext(this.#key) && this.#create()) || this.#state.current!
		);
	}

	set Provider(value: T) {
		this.#state = { current: value };
		setContext(this.#key, this.#state);
	}

	update(getter: () => T) {
		const context = { current: this.#get() };

		$effect(() => {
			context.current = getter();
		});
	}
}
