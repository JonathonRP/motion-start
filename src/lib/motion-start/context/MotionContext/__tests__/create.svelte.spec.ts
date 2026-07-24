import { flushSync } from 'svelte';
import { describe, expect, test } from 'vitest';
import type { MotionProps } from '../../../motion/types.js';
import type { MotionContext } from '../index.js';
import { useCreateMotionContext } from '../create.svelte.js';

describe('useCreateMotionContext', () => {
	test('reactively derives tree variants from changing Svelte state', () => {
		const cleanup = $effect.root(() => {
			let props = $state<MotionProps>({ animate: { opacity: 1 } });
			let parent = $state<MotionContext>({ initial: 'hidden', animate: 'visible' });
			const context = useCreateMotionContext(() => props, parent);

			expect(context()).toEqual({ initial: 'hidden', animate: 'visible' });

			props = { initial: false, animate: 'selected' };
			flushSync();
			expect(context()).toEqual({ initial: false, animate: 'selected' });

			props = { animate: { opacity: 0 } };
			parent.initial = 'collapsed';
			parent.animate = 'expanded';
			flushSync();
			expect(context()).toEqual({ initial: 'collapsed', animate: 'expanded' });
		});

		cleanup();
	});
});
