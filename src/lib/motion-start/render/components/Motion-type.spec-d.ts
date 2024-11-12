import type { Component } from 'svelte';
import type { CustomMotionComponentConfig } from './motion-proxy.js';
import type { MotionProps } from '../../motion/types.js';
import type { IsSVG } from './motion.js';
import { motion } from './motion.js';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for Motion', () => {
		assertType<Component<CustomMotionComponentConfig & MotionProps & IsSVG>>(motion.div.prototype);
	});
});
