import type { Component } from 'svelte';
import LayoutGroup from './LayoutGroup.svelte';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for LayoutGroup', () => {
		// Type-only assertion; no runtime expect in dts tests
		assertType<Component>(LayoutGroup as unknown as Component);
	});
});
