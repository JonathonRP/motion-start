import { createSubscriber } from 'svelte/reactivity';

/**
 * An opaque token that changes identity every time `invalidate()` is called.
 * Consumers should never rely on its shape — only on whether it is
 * reference-equal to a previously observed token.
 */
declare const invalidationToken: unique symbol;
export type InvalidationToken = Readonly<{ [invalidationToken]: true }>;

/**
 * @internal
 */
export interface ReactiveInvalidation {
	/**
	 * Reading `current` inside a `$derived` or `$effect` registers it as a
	 * reactive dependency: whenever `invalidate()` is called, tracked effects
	 * re-run. Outside of a reactive context this simply returns the latest
	 * token without subscribing.
	 */
	readonly current: InvalidationToken;
	/**
	 * Produces a new, distinct token and notifies any tracked effects.
	 * Safe to call before anything has subscribed to `current`.
	 */
	invalidate(): void;
}

/**
 * Creates a lightweight reactive invalidation signal backed by Svelte's
 * `createSubscriber`. Reading `.current` inside an effect subscribes that
 * effect to future `invalidate()` calls; the subscription is automatically
 * torn down once no tracked effects remain.
 *
 * @internal
 */
export function createReactiveInvalidation(): ReactiveInvalidation {
	let token = {} as InvalidationToken;
	let notify: (() => void) | undefined;

	const subscribe = createSubscriber((update) => {
		notify = update;

		return () => {
			notify = undefined;
		};
	});

	return {
		get current() {
			subscribe();
			return token;
		},
		invalidate() {
			token = {} as InvalidationToken;
			notify?.();
		},
	};
}
