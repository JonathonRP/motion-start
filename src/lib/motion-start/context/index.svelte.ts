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
	readonly #initial: T;

	public constructor(initial: T) {
		this.#key = Symbol(nanoid());
		this.#initial = initial;
	}

	private exists = () => {
		return hasContext(this.#key);
	};

	private create = () => {
		const _value = $state({ current: this.#initial });
		return setContext(this.#key, _value);
	};

	private get = () => {
		return getContext<MutableRefObject<T>>(this.#key);
	};

	// private pipe(...transformers: Transformer<T>[]) {
	// 	return [...transformers].reduce(
	// 		(value, fn: Transformer<T> | (() => MutableRefObject<T>)) => {
	// 			let result = isTransformer(fn) ? fn.call(this, value.current) : fn.bind(this)();
	// 			return {
	// 				get current() {
	// 					return isRefObject(result) ? result.current : result;
	// 				},
	// 				set current(v) {
	// 					if (isRefObject(result)) {
	// 						result.current = v;
	// 						return;
	// 					}
	// 					result = v;
	// 				},
	// 			};
	// 		},

	// 	);
	// }

	// set Provider(value: T) {
	// 	const _value = $state({ current: value });
	// 	setContext(this.#key, _value);
	// }

	// update(getter: () => T) {
	// 	const context = this.pipe();

	// 	$effect(() => {
	// 		context.current = getter();
	// 	});
	// }
}
