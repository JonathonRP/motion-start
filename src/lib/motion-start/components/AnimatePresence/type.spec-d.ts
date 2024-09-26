import type { Component } from 'svelte';
import type { AnimatePresenceProps } from './index.js';
import AnimatePresence from './AnimatePresence.svelte';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for AnimatePresence', () => {
		assertType<Component<AnimatePresenceProps<{ key: unknown }>>>(AnimatePresence);
	});
});
