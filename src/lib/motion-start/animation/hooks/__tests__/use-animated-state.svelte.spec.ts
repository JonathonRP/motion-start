import { flushSync } from 'svelte';
import { describe, expect, test } from 'vitest';
import { frame } from '../../../frameloop/frame.js';
import { useAnimatedState } from '../use-animated-state.svelte.js';

describe('useAnimatedState', () => {
	test('returns a callable animation starter and reactive state', async () => {
		let read!: ReturnType<typeof useAnimatedState>;
		const cleanup = $effect.root(() => {
			read = useAnimatedState({ opacity: 1 });
		});
		flushSync();

		const [, start] = read();
		const animation = start({ opacity: 0, transition: { duration: 0 } });
		expect(animation).toBeInstanceOf(Promise);
		await new Promise<void>((resolve) => frame.postRender(() => resolve()));
		await animation;
		flushSync();
		expect(read()[0]).toMatchObject({ opacity: 0 });

		cleanup();
	});
});
