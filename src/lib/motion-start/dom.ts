/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export { motionValue, MotionValue } from './value/index.svelte';
export type { PassiveEffect, Subscriber } from './value/index.svelte';
export { animate, createScopedAnimate } from './animation/animate/index.svelte';
export { animateMini } from './animation/animators/waapi/animate-style.svelte';
export { scroll } from './render/dom/scroll';
export { scrollInfo } from './render/dom/scroll/track';
export { inView } from './render/dom/viewport';

/**
 * Easing
 */
export * from './easing/anticipate';
export * from './easing/back';
export * from './easing/circ';
export * from './easing/ease';
export * from './easing/cubic-bezier';
export * from './easing/steps';
export * from './easing/modifiers/mirror';
export * from './easing/modifiers/reverse';
export * from './easing/types';

/**
 * Animation generators
 */
export { spring } from './animation/generators/spring/index.svelte';
export { inertia } from './animation/generators/inertia.svelte';
export { keyframes } from './animation/generators/keyframes.svelte';

/**
 * Utils
 */
export { stagger } from './animation/utils/stagger.svelte';
export { transform } from './utils/transform';
export { clamp } from './utils/clamp';
export { delayInSeconds as delay, type DelayedFunction } from './utils/delay';
export * from './utils/distance';
export * from './utils/errors';
export * from './utils/interpolate';
export { mix } from './utils/mix';
export { pipe } from './utils/pipe';
export { progress } from './utils/progress';
export { wrap } from './utils/wrap';
export * from './frameloop';

/**
 * Deprecated
 */
export { sync, cancelSync } from './frameloop/index-legacy.svelte';
