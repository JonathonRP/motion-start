import type { Component } from 'svelte';
import type { MotionProps } from '../../../motion/types.js';
import { m } from './proxy.js';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for M', () => {
		assertType<Component<MotionProps>>(m.div.prototype);
	});
});
