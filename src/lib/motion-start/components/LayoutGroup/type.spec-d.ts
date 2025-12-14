import type { Component } from 'svelte';
import LayoutGroup, { type LayoutGroupProps } from './LayoutGroup.svelte';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for LayoutGroup', () => {
		// @ts-ignore - Svelte automatically adds children to component Props
		assertType<Component<LayoutGroupProps>>(LayoutGroup);
	});
});
