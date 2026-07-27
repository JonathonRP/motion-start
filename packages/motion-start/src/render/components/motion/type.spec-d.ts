import type { Component } from 'svelte';
import type { MotionProps } from '../../../motion/types.js';
import { motion } from './proxy.js';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for Motion', () => {
		assertType<Component<MotionProps>>(motion.div.prototype);
	});
});
