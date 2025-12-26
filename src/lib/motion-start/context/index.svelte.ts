/**
 * Context class for Svelte 5 runes mode
 * Based on framer-motion@11.11.11 patterns
 *
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import { nanoid } from 'nanoid/non-secure';
import type { MutableRefObject } from '../utils/safe-react-types.js';
import { getContext, hasContext, setContext } from 'svelte';

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
}
