import { nanoid } from 'nanoid/non-secure';
import type { MutableRefObject, RefObject } from '../utils/safe-react-types';
import { getContext, hasContext, onMount, setContext, untrack } from 'svelte';
import { isRefObject } from '../utils/is-ref-object';

type Transformer<T> = ((arg?: T) => T) & { __brand: 'transformer' };

function isTransformer<T>(arg: Transformer<T> | (() => MutableRefObject<T>)): arg is Transformer<T> {
	return '__brand' in arg && arg.__brand === 'transformer';
}

export class Context<T> {
	readonly #key: symbol;
	readonly #init: T;

	public constructor(initial: T) {
		this.#key = Symbol(nanoid());
		this.#init = initial;
	}

	private exists = () => {
		return hasContext(this.#key);
	};

	private create = () => {
		// while we can now do $state({ current: initial }) in constructor,
		// we do it here because it breaks layout animations playing, so the context setting must be lazy
		// also reactivity breaks and causes over fire.
		const _value = $state({ current: this.#init });
		return setContext(this.#key, _value);
	};

	private get = () => {
		return getContext<MutableRefObject<T>>(this.#key);
	};

	// set(v: T) {
	// 	this.#state = { current: v };
	// }

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
