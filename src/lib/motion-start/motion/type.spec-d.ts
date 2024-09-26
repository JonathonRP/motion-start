import type { Component } from 'svelte';
import type { CustomMotionComponentConfig } from '../render/dom/motion-proxy.js';
import type { MotionProps } from './types.js';
import type { IsSVG } from '../render/dom/motion.js';
import Motion from './Motion.svelte';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for Motion', () => {
		assertType<Component<CustomMotionComponentConfig & MotionProps & IsSVG>>(Motion);
	});
});
