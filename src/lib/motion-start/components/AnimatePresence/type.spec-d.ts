import type { Component } from 'svelte';
import AnimatePresence from './AnimatePresence.svelte';
import type { AnimatePresenceProps } from './index.js';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for AnimatePresence', () => {
		assertType<Component<AnimatePresenceProps<{ key: unknown }>>>(AnimatePresence);
	});
});
