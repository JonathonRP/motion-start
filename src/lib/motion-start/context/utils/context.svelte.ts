import { getContext, onMount, setContext, untrack } from 'svelte';
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
	#state: T | undefined = undefined;

	public constructor(private initial: T) {
		super(() => {
			this.#state = getContext<T>(this);

			return this.#state || this.initial;
		});
		this.#state = this.initial;
	}

	set Provider(value: UnwrapWritable<T>) {
		$inspect.trace('set context');
		setContext(this, this.#state || this.initial).set(value);
	}
}

export function createContext<T>(defaultValue: T) {
	return new Context<Writable<T>>(writable(defaultValue));
}

export function useContext<T>(context: Context<Writable<T>>) {
	return context();
}
