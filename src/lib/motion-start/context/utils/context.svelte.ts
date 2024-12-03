import { getContext, setContext } from 'svelte';
import { getDomContext, setDomContext } from '../DOMcontext';
import { writable, type Writable } from 'svelte/store';
import { nanoid } from 'nanoid/non-secure';

type UnwrapWritable<T> = T extends Writable<infer I> ? I : T;

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
interface CallableContext<T> {
	readonly prototype: CallableContext<T>;

	(c?: any): T;
}

class CallableContext<T> extends Function {
	// @ts-expect-error
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	// biome-ignore lint/correctness/noUnreachableSuper: <explanation>
	constructor(f: (c?: any) => T) {
		// biome-ignore lint/correctness/noConstructorReturn: <explanation>
		return Object.setPrototypeOf(f, new.target.prototype);
	}
}

class Context<T> extends CallableContext<T> {
	private _key = `${Symbol('motion-start').toString()}-${nanoid()}`;

	public constructor(
		private _default: T,
		private _c?: any
	) {
		super((c?: any) => {
			let context = null;
			$effect(() => {
				context = getDomContext(this.key, this.c || c);
			});
			return getContext<T>(this) || context || this._default;
		});
	}

	set Provider(value: UnwrapWritable<T>) {
		$effect(() => {
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

export function createContext<T>(defaultValue: T, c?: any) {
	return new Context<Writable<T>>(writable(defaultValue), c);
}

export function useContext<T>(context: Context<T>, c?: any) {
	return context(c);
}
