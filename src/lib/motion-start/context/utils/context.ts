import type { RefObject } from '$lib/motion-start/utils/safe-react-types';
import { getContext, hasContext, onMount, setContext, untrack } from 'svelte';
import { createSubscriber } from 'svelte/reactivity';
import { fromStore, toStore, writable, type Writable } from 'svelte/store';

type UnwrapWritable<T> = T extends Writable<infer I> ? I : T;

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
interface CallableContext<T> {
	readonly prototype: CallableContext<T>;

	(): RefObject<UnwrapWritable<T>>;
}

class CallableContext<T> extends Function {
	// @ts-expect-error
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	// biome-ignore lint/correctness/noUnreachableSuper: <explanation>
	constructor(get: () => RefObject<UnwrapWritable<T>>) {
		// biome-ignore lint/correctness/noConstructorReturn: <explanation>
		return Object.setPrototypeOf(get, new.target.prototype);
	}
}

class Context<T extends Writable<UnwrapWritable<T>>> extends CallableContext<T> {
	#state: T;

	public constructor(private initial: T) {
		super(() => {
			// if (!hasContext(this)) {
			// 	this.#state = setContext(this, initial);
			// } else {
			this.#state = getContext<T>(this);
			// }

			return fromStore(this.#state || initial);
		});
		this.#state = this.initial;
	}

	set Provider(value: UnwrapWritable<T>) {
		setContext(
			this,
			toStore(() => value)
		);
	}
}

export function createContext<T>(defaultValue: T) {
	return new Context<Writable<T>>(writable(defaultValue));
}

export function useContext<T>(context: Context<Writable<T>>) {
	return context();
}
