import type { Component } from 'svelte';
import type { CustomMotionComponentConfig } from './motion-proxy.js';
import type { MotionProps } from '../../motion/types.js';
import type { IsSVG } from './motion.js';
import { m } from './motion-minimal.js';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for M', () => {
		assertType<Component<CustomMotionComponentConfig & MotionProps & IsSVG>>(m.div.prototype);
	});
});
