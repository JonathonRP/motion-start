import type { SvelteComponent } from 'svelte';
import type { ConstructorOfATypedSvelteComponent } from './svelteTypes.js';
import type { AnimatePresenceProps, MotionConfigProps, MotionProps, SharedLayoutProps } from '../../src/index.js'
import { M, Motion, AnimatePresence, AnimateSharedLayout, MotionConfig, UseDomEvent } from '../../src/index.js';
import type { ConditionalGeneric } from '../../src/components/AnimatePresence/types.js';
import type { CustomMotionComponentConfig } from '../../src/render/dom/motion-proxy.js';
import type { IsSVG } from '../../src/render/dom/motion.js';
import type { UseDomEventProps } from '../../src/events/use-dom-event.js';

describe('test components type - svelte 4', () => {
    it('should have Svelte legacy component type for Motion', () => {
        assertType<SvelteComponent<CustomMotionComponentConfig & MotionProps & IsSVG, {}, {default: { props:object, motion: import('svelte/action').Action }}>>(new Motion({target: new Element }));
    })

    // it('should have Svelte legacy component type for M', () => {
    //     assertType<SvelteComponent<CustomMotionComponentConfig & MotionProps & IsSVG, {}, {default: { props:object, motion: import('svelte/action').Action }}>>(new M({target: new Element }));
    // })

    it('should have Svelte legacy component type for AnimatePresence', () => {
        assertType<SvelteComponent<AnimatePresenceProps<any>, {}, {default:{ item: ConditionalGeneric<any> }}>>(new AnimatePresence({ target: new Element }));
    })

    it('should have Svelte legacy component type for AnimateSharedLayout', () => {
        assertType<SvelteComponent<SharedLayoutProps, {}, {default:{}}>>(new AnimateSharedLayout({ target: new Element }));
    })

    it('should have Svelte legacy component type for MotionConfig', () => {
        assertType<SvelteComponent<MotionConfigProps, {}, {default:{}}>>(new MotionConfig({ target: new Element }));
    })

    it('should have Svelte legacy component type for UseDomEvent', () => {
        assertType<SvelteComponent<UseDomEventProps, {}, {default:{}}>>(new UseDomEvent({ target: new Element }));
    })
})

describe('test components type - svelte 5', () => {
    it('should have Svelte component type for Motion', () => {
        assertType<ConstructorOfATypedSvelteComponent>(Motion);
    })

    it('should have Svelte component type for AnimatePresence', () => {
        assertType<ConstructorOfATypedSvelteComponent>(AnimatePresence);
    })

    it('should have Svelte component type for AnimateSharedLayout', () => {
        assertType<ConstructorOfATypedSvelteComponent>(AnimateSharedLayout);
    })

    it('should have Svelte component type for MotionConfig', () => {
        assertType<ConstructorOfATypedSvelteComponent>(MotionConfig);
    })

    it('should have Svelte component type for UseDomEvent', () => {
        assertType<ConstructorOfATypedSvelteComponent>(UseDomEvent);
    })
})