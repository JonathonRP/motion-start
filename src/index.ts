/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
export { FramerTreeLayoutContext } from './context/SharedLayoutContext.js';

export { UseGestures } from './gestures/use-gestures.js';
export { UsePanGesture } from './gestures/use-pan-gesture.js';
export { UseTapGesture } from './gestures/use-tap-gesture.js';

export { default as MotionSSR } from './motion/MotionSSR.svelte';

export { UseAnimation } from './animation/use-animation.js';

export { default as Mdiv, default as MotionDiv } from './components/MotionDiv.svelte';

// ----------------------------------------------------------------------------------------------

/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Components
 */
export { AnimatePresence } from "./components/AnimatePresence/index.js";
export { AnimateSharedLayout } from "./components/AnimateSharedLayout/index.js";
export { LazyMotion } from "./components/LazyMotion/index.js";
export { MotionConfig } from "./components/MotionConfig/index.js";
export { M } from "./render/dom/motion-proxy.js";
export { Motion /*, createDomMotionComponent*/, Motion as MotionSVG } from "./render/dom/motion.js";
/**
 * Features
 */
// export { domMax, domAnimation } from "./render/dom/featureBundle.js";
/**
 * Motion values
 */
export { MotionValue, motionValue, type PassiveEffect, type Subscriber } from "./value/index.js";
export { useElementScroll } from "./value/scroll/use-element-scroll.js";
export { useViewportScroll } from "./value/scroll/use-viewport-scroll.js";
export { useMotionTemplate } from "./value/use-motion-template.js";
export { useMotionValue } from "./value/use-motion-value.js";
export { useSpring } from "./value/use-spring.js";
export { useTransform } from "./value/use-transform.js";
export { useVelocity } from "./value/use-velocity.js";
export { resolveMotionValue } from "./value/utils/resolve-motion-value.js";
/**
 * Accessibility
 */
export { useReducedMotion } from "./utils/use-reduced-motion.js";
/**
 * Utils
 */
export { animate } from "./animation/animate.js";
export { animationControls } from "./animation/animation-controls.js";
export type { AnimationControls } from "./animation/types.js";
export { useAnimation } from "./animation/use-animation.js";
export { useIsPresent, usePresence } from "./components/AnimatePresence/use-presence.js";
export { createCrossfader } from "./components/AnimateSharedLayout/utils/crossfader.js";
export { UseDomEvent } from "./events/use-dom-event.js";
export { type PanInfo } from "./gestures/PanSession.js";
export { DragControls, useDragControls } from "./gestures/drag/use-drag-controls.js";
export type { FocusHandlers, HoverHandlers, PanHandlers, TapHandlers, TapInfo } from "./gestures/types.js";
export { createMotionComponent } from "./motion/index.js";
export { isValidMotionProp } from "./motion/utils/valid-prop.js";
export { addScaleCorrection } from "./render/dom/projection/scale-correction.js";
export { snapshotViewportBox } from "./render/dom/projection/utils.js";
export { batchLayout, flushLayout } from "./render/dom/utils/batch-layout.js";
export { visualElement } from "./render/index.js";
export type { VisualElement } from "./render/types.js";
export { animateVisualElement } from "./render/utils/animation.js";
export { transform } from "./utils/transform.js";
export { useCycle } from "./utils/use-cycle.js";
/**
 * Contexts
 */
export { LayoutGroupContext } from "./context/LayoutGroupContext.js";
export { MotionConfigContext } from "./context/MotionConfigContext.js";
export { PresenceContext } from "./context/PresenceContext.js";
/**
 * Types
 */
export type { AnimationOptions, AnimationPlaybackControls } from "./animation/animate.js";
export type { AnimatePresenceProps } from "./components/AnimatePresence/types.js";
export type { SharedLayoutAnimationConfig, SharedLayoutProps, SharedLayoutSyncMethods, SyncLayoutLifecycles, VisibilityAction } from "./components/AnimateSharedLayout/types.js";
export { createBatcher } from "./components/AnimateSharedLayout/utils/batcher.js";
export type { LazyProps } from "./components/LazyMotion/types.js";
export type { MotionConfigProps } from "./components/MotionConfig/index.js";
export type { SharedLayoutContext } from "./context/SharedLayoutContext.js";
export type { EventInfo } from "./events/types.js";
export type { DragElastic, DragHandlers, DraggableProps } from "./gestures/drag/types.js";
export type { LayoutProps } from "./motion/features/layout/types.js";
export * from "./motion/features/types.js";
export type { AnimationProps, MotionAdvancedProps, MotionProps, MotionStyle, MotionTransform, RelayoutInfo, ResolveLayoutTransition, VariantLabels } from "./motion/types.js";
export type { CustomDomComponent } from "./render/dom/motion-proxy.js";
export type { ForwardRefComponent, HTMLMotionProps } from "./render/html/types.js";
export type { SVGAttributesAsMotionValues, SVGMotionProps } from "./render/svg/types.js";
export { FlatTree } from "./render/utils/flat-tree.js";
export type { VisualElementLifecycles } from "./render/utils/lifecycles.js";
export type { CustomValueType, EasingFunction, Inertia, Keyframes, KeyframesTarget, None, Orchestration, Repeat, ResolvedKeyframesTarget, ResolvedSingleTarget, ResolvedValueTarget, SingleTarget, Spring, Target, TargetAndTransition, Transition, Tween, ValueTarget, Variant, Variants } from "./types.js";
export * from "./types/geometry.js";
export type { ScrollMotionValues } from "./value/scroll/utils.js";

