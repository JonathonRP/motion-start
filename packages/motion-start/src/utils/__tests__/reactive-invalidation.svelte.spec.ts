import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createReactiveInvalidation } from '../reactive-invalidation.js';
import ReactiveInvalidationEffectFixture from './ReactiveInvalidationEffectFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
});

describe('createReactiveInvalidation', () => {
	it('changes its current token on every invalidation', () => {
		const invalidation = createReactiveInvalidation();
		const tokens = [invalidation.current];

		invalidation.invalidate();
		tokens.push(invalidation.current);
		invalidation.invalidate();
		tokens.push(invalidation.current);

		expect(new Set(tokens).size).toBe(3);
	});

	it('reruns dependent effects once per flushed invalidation and unsubscribes on teardown', async () => {
		const invalidation = createReactiveInvalidation();
		const onrun = vi.fn();

		instance = mount(ReactiveInvalidationEffectFixture, {
			target: document.body,
			props: { invalidation, onrun },
		});
		flushSync();

		invalidation.invalidate();
		flushSync();
		invalidation.invalidate();
		flushSync();

		await unmount(instance);
		instance = undefined;
		invalidation.invalidate();
		flushSync();

		expect(onrun).toHaveBeenCalledTimes(3);
	});
});
