import type { Component } from 'svelte';
import type { CustomMotionComponentConfig } from './motion-proxy.js';
import type { MotionProps } from '../../motion/types.js';
import type { IsSVG } from './motion.js';
import { M } from './motion-proxy.js';

describe('test components type - svelte 5', () => {
    it('should have Svelte component type for M', () => {
        assertType<Component<CustomMotionComponentConfig & MotionProps & IsSVG>>(M.div.prototype);
    });
});