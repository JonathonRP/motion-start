import { nanoid } from 'nanoid/non-secure';
import type { MutableRefObject, RefObject } from '../utils/safe-react-types';
import { getContext, hasContext, onMount, setContext, untrack } from 'svelte';
import { createSubscriber } from 'svelte/reactivity';
import { fromStore, toStore, writable, type Writable } from 'svelte/store';
import { isRefObject } from '../utils/is-ref-object';

type Transformer<T> = ((arg?: T) => T) & { __brand: 'transformer' };

function isTransformer<T>(arg: Transformer<T> | (() => MutableRefObject<T>)): arg is Transformer<T> {
	return '__brand' in arg && arg.__brand === 'transformer';
}

export class Context<T> {
	readonly #key: symbol;
	#state = $state<MutableRefObject<T>>({ current: null! });

	public constructor(initial: T) {
		this.#key = Symbol(nanoid());
		this.#state = { current: initial };
	}

	#create() {
		return setContext(this.#key, this.#state);
	}

	#get() {
		return getContext<MutableRefObject<T>>(this.#key);
	}

	private pipe(...transformers: Transformer<T>[]) {
		return [...(!hasContext(this.#key) ? [this.#create] : [this.#get]), ...transformers].reduce(
			(value, fn: Transformer<T> | (() => MutableRefObject<T>)) => {
				const result = isTransformer(fn) ? fn.call(this, value.current) : fn.bind(this)();
				return isRefObject(result) ? result : Object.assign(this.#state, { current: result });
			},
			this.#state
		);
	}

	set Provider(value: T) {
		this.#state = { current: value };
		setContext(this.#key, this.#state);
	}

	update(getter: () => T, cleanup?: () => void) {
		const context = this.pipe();

		$effect(() => {
			context.current = getter();

			return cleanup && cleanup;
		});
	}
}
