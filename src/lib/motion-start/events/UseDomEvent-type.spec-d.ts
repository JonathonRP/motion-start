import type { Component } from 'svelte';
import { UseDomEvent, type UseDomEventProps } from './use-dom-event';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for UseDomEvent', () => {
		assertType<Component<UseDomEventProps>>(UseDomEvent);
	});
});
