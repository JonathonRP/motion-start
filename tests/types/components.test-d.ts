import type { Component } from 'svelte';
import type { UseDomEventProps } from '../../src/events/use-dom-event.js';
import type { AnimatePresenceProps, MotionConfigProps, MotionProps, SharedLayoutProps } from '../../src/index.js';
import { AnimatePresence, AnimateSharedLayout, M, Motion, MotionConfig, UseDomEvent } from '../../src/index.js';
import type { CustomMotionComponentConfig } from '../../src/render/dom/motion-proxy.js';
import type { IsSVG } from '../../src/render/dom/motion.js';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for Motion', () => {
		assertType<Component<CustomMotionComponentConfig & MotionProps & IsSVG>>(Motion);
	});

	it('should have Svelte component type for M', () => {
		assertType<Component<CustomMotionComponentConfig & MotionProps & IsSVG>>(M.div.prototype);
	});

	it('should have Svelte component type for AnimatePresence', () => {
		assertType<Component<AnimatePresenceProps<any>>>(AnimatePresence);
	});

	it('should have Svelte component type for AnimateSharedLayout', () => {
		assertType<Component<SharedLayoutProps>>(AnimateSharedLayout);
	});

	it('should have Svelte component type for MotionConfig', () => {
		assertType<Component<MotionConfigProps>>(MotionConfig);
	});

	it('should have Svelte component type for UseDomEvent', () => {
		assertType<Component<UseDomEventProps>>(UseDomEvent);
	});
});
