import type { Component, SvelteComponent } from 'svelte';
import type { UseDomEventProps } from '../../src/events/use-dom-event.js';
import type { AnimatePresenceProps, MotionConfigProps, MotionProps, SharedLayoutProps } from '../../src/index.js';
import { AnimatePresence, AnimateSharedLayout, M, Motion, MotionConfig, UseDomEvent } from '../../src/index.js';
import type { CustomMotionComponentConfig } from '../../src/render/dom/motion-proxy.js';
import type { IsSVG } from '../../src/render/dom/motion.js';

describe('test components type - svelte 4', () => {
    it('should have Svelte legacy component type for Motion', () => {
        assertType<SvelteComponent<CustomMotionComponentConfig & MotionProps & IsSVG, {}, {default: { props:object, motion: import('svelte/action').Action }}>>(Motion.prototype);
    })

    it('should have Svelte legacy component type for M', () => {
        assertType<SvelteComponent<CustomMotionComponentConfig & MotionProps & IsSVG, {}, {default: { props:object, motion: import('svelte/action').Action }}>>(M.div.prototype);
    })

    it('should have Svelte legacy component type for AnimatePresence', () => {
        assertType<SvelteComponent<AnimatePresenceProps<any>, {}, {default:{ item: any }}>>(AnimatePresence.prototype);
    })

    it('should have Svelte legacy component type for AnimateSharedLayout', () => {
        assertType<SvelteComponent<SharedLayoutProps, {}, {default:{}}>>(AnimateSharedLayout.prototype);
    })

    it('should have Svelte legacy component type for MotionConfig', () => {
        assertType<SvelteComponent<MotionConfigProps, {}, {default:{}}>>(MotionConfig.prototype);
    })

    it('should have Svelte legacy component type for UseDomEvent', () => {
        assertType<SvelteComponent<UseDomEventProps, {}, {default:{}}>>(UseDomEvent.prototype);
    })
})

describe('test components type - svelte 5', () => {
    it('should have Svelte component type for Motion', () => {
        assertType<Component<CustomMotionComponentConfig & MotionProps & IsSVG>>(Motion);
    })

    it('should have Svelte component type for M', () => {
        assertType<Component<CustomMotionComponentConfig & MotionProps & IsSVG>>(M.div.prototype);
    })

    it('should have Svelte component type for AnimatePresence', () => {
        assertType<Component<AnimatePresenceProps<any>>>(AnimatePresence);
    })

    it('should have Svelte component type for AnimateSharedLayout', () => {
        assertType<Component<SharedLayoutProps>>(AnimateSharedLayout);
    })

    it('should have Svelte component type for MotionConfig', () => {
        assertType<Component<MotionConfigProps>>(MotionConfig);
    })

    it('should have Svelte component type for UseDomEvent', () => {
        assertType<Component<UseDomEventProps>>(UseDomEvent);
    })
})