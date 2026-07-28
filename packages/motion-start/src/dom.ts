/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export { motionValue, MotionValue } from './value/index.js';
export type { PassiveEffect, Subscriber } from './value/index.js';
export { animate, createScopedAnimate } from './animation/animate/index.js';
export { animateMini } from './animation/animators/waapi/animate-style.js';
export { scroll } from './render/dom/scroll/index.js';
export { scrollInfo } from './render/dom/scroll/track.js';
export { inView } from './render/dom/viewport/index.js';

/**
 * Easing
 */
export * from './easing/anticipate.js';
export * from './easing/back.js';
export * from './easing/circ.js';
export * from './easing/ease.js';
export * from './easing/cubic-bezier.js';
export * from './easing/steps.js';
export * from './easing/modifiers/mirror.js';
export * from './easing/modifiers/reverse.js';
export * from './easing/types.js';

/**
 * Animation generators
 */
export { spring } from './animation/generators/spring/index.js';
export { inertia } from './animation/generators/inertia.js';
export { keyframes } from './animation/generators/keyframes.js';

/**
 * Utils
 */
export { stagger } from './animation/utils/stagger.js';
export { transform } from './utils/transform.js';
export { clamp } from './utils/clamp.js';
export { delayInSeconds as delay, type DelayedFunction } from './utils/delay.js';
export * from './utils/distance.js';
export * from './utils/errors.js';
export * from './utils/interpolate.js';
export { mix } from './utils/mix/index.js';
export { pipe } from './utils/pipe.js';
export { progress } from './utils/progress.js';
export { wrap } from './utils/wrap.js';
export * from './frameloop/index.js';

/**
 * Deprecated
 */
export { sync, cancelSync } from './frameloop/index-legacy.js';
