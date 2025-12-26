import type { Component } from 'svelte';
import AnimateSharedLayout from './AnimateSharedLayout.svelte';
import type { SharedLayoutProps } from './index.js';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for AnimateSharedLayout', () => {
		assertType<Component<SharedLayoutProps>>(AnimateSharedLayout);
	});
});
