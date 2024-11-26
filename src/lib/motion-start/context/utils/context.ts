import { getContext, onMount, setContext } from 'svelte';
import { getDomContext, setDomContext } from '../DOMcontext';
import { writable, type Writable } from 'svelte/store';

type UnwrapWritable<T> = T extends Writable<infer I> ? I : T;

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
interface CallableContext<T> {
	readonly prototype: CallableContext<T>;

	(c?: any): Writable<UnwrapWritable<T> | null | undefined | {}>;
}

class CallableContext<T> extends Function {
	// @ts-expect-error
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	// biome-ignore lint/correctness/noUnreachableSuper: <explanation>
	constructor(f: (c?: any) => Writable<UnwrapWritable<T> | null | undefined | {}>) {
		// biome-ignore lint/correctness/noConstructorReturn: <explanation>
		return Object.setPrototypeOf(f, new.target.prototype);
	}
}

class Context<T> extends CallableContext<T> {
	private _key: any = this;

	public constructor(
		private _default: UnwrapWritable<T> | null = null,
		private _c?: any
	) {
		super((c?: any) => {
			let context = null;
			onMount(() => {
				context = getDomContext(this.key, this.c || c);
			});
			return getContext<Writable<UnwrapWritable<T>>>(this) || context || writable(this._default);
		});
	}

	set Provider(value: UnwrapWritable<T>) {
		onMount(() => {
			setDomContext(this.key, this.c, writable(value));
		});
		setContext(this, writable(value));
	}

	get key() {
		return this._key;
	}

	get c() {
		return this._c;
	}
}

export function createContext<T>(defaultValue: any = null, c?: any) {
	return new Context<Writable<T>>(defaultValue, c);
}

export function useContext<T>(context: Context<T>, c?: any) {
	return context(c);
}
