import type { Component } from 'svelte';
import type { MotionConfigProps } from './index.js';
import MotionConfig from './MotionConfig.svelte';

describe('test components type - svelte 5', () => {
    it('should have Svelte component type for MotionConfig', () => {
        assertType<Component<MotionConfigProps>>(MotionConfig);
    });
});