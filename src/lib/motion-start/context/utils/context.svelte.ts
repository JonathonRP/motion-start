import { getContext, hasContext, onMount, setContext, untrack } from 'svelte';
import type { createSubscriber } from 'svelte/reactivity';
import { writable, type Writable } from 'svelte/store';

type UnwrapWritable<T> = T extends Writable<infer I> ? I : T;

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
interface CallableContext<T> {
	readonly prototype: CallableContext<T>;

	(): T;
}

class CallableContext<T> extends Function {
	// @ts-expect-error
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	// biome-ignore lint/correctness/noUnreachableSuper: <explanation>
	constructor(f: () => T) {
		// biome-ignore lint/correctness/noConstructorReturn: <explanation>
		return Object.setPrototypeOf(f, new.target.prototype);
	}
}

class Context<T extends Writable<UnwrapWritable<T>>> extends CallableContext<T> {
	// #update: () => void;
	// #subscribe: ReturnType<typeof createSubscriber>;
	#state: T;

	public constructor(private initial: T) {
		super(() => {
			// this.#subscribe();
			this.#state = getContext<T>(this);

			return this.#state || initial;
		});
		this.#state = this.initial;
		// this.#subscribe = createSubscriber((update) => {
		// 	this.#update = update;

		// 	return this.#state?.subscribe(update);
		// });
	}

	set Provider(value: UnwrapWritable<T>) {
		setContext(this, writable(value));
		// this.#update?.();
	}
}

export function createContext<T>(defaultValue: T) {
	return new Context<Writable<T>>(writable(defaultValue));
}

export function useContext<T>(context: Context<Writable<T>>) {
	return context();
}
