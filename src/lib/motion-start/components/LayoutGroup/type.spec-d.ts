import type { Component } from 'svelte';
import LayoutGroup, { type LayoutGroupProps } from './LayoutGroup.svelte';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for LayoutGroup', () => {
		assertType<Component<LayoutGroupProps>>(LayoutGroup);
	});
});
