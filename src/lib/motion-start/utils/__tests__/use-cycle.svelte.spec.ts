import { flushSync } from 'svelte';
import { describe, expect, it } from 'vitest';
import { useCycle } from '../use-cycle.svelte.js';

describe('useCycle', () => {
	it('cycles explicitly back to index zero', () => {
		let read!: () => string;
		let cycle!: (index?: number) => void;
		const cleanup = $effect.root(() => {
			[read, cycle] = useCycle('a', 'b', 'c');
		});
		flushSync();

		cycle();
		flushSync();
		expect(read()).toBe('b');

		cycle(0);
		flushSync();
		expect(read()).toBe('a');

		cleanup();
	});
});
