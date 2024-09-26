import type { Component } from 'svelte';
import type { UseDomEventProps } from './use-dom-event.js';
import UseDomEvent from './UseDomEvent.svelte';

describe('test components type - svelte 5', () => {
    it('should have Svelte component type for UseDomEvent', () => {
        assertType<Component<UseDomEventProps>>(UseDomEvent);
    });
});