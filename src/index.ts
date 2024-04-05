/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
export { FramerTreeLayoutContext } from './context/SharedLayoutContext.js';

export { UsePanGesture } from './gestures/use-pan-gesture.js';
export { UseTapGesture } from './gestures/use-tap-gesture.js';
export { UseGestures } from './gestures/use-gestures.js';

export { default as MotionSSR } from './motion/MotionSSR.svelte';

export { UseAnimation } from './animation/use-animation.js';

export {default as Mdiv, default as MotionDiv} from './components/MotionDiv.svelte';

// ----------------------------------------------------------------------------------------------

/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Components
 */
export { Motion/*, createDomMotionComponent*/, M, Motion as MotionSVG } from "./render/dom/motion.js";
//export { m } from "./render/dom/motion-minimal";
export { AnimatePresence } from "./components/AnimatePresence/index.js";
export { AnimateSharedLayout } from "./components/AnimateSharedLayout/index.js";
export { MotionConfig } from "./components/MotionConfig/index.js";
export { LazyMotion } from "./components/LazyMotion/index.js";
/**
 * Features
 */
export { domMax, domAnimation } from "./render/dom/featureBundle.js";
/**
 * Motion values
 */
export { useMotionValue } from "./value/use-motion-value.js";
export { useMotionTemplate } from "./value/use-motion-template.js";
export { MotionValue, motionValue, PassiveEffect, Subscriber } from "./value/index.js";
export { resolveMotionValue } from "./value/utils/resolve-motion-value.js";
export { useTransform } from "./value/use-transform.js";
export { useSpring } from "./value/use-spring.js";
export { useVelocity } from "./value/use-velocity.js";
export { useElementScroll } from "./value/scroll/use-element-scroll.js";
export { useViewportScroll } from "./value/scroll/use-viewport-scroll.js";
/**
 * Accessibility
 */
export { useReducedMotion } from "./utils/use-reduced-motion.js";
/**
 * Utils
 */
export { animationControls } from "./animation/animation-controls.js";
export { AnimationControls } from "./animation/types.js";
export { useAnimation } from "./animation/use-animation.js";
export { animate } from "./animation/animate.js";
export { animateVisualElement } from "./render/utils/animation.js";
export { HoverHandlers, TapHandlers, PanHandlers, FocusHandlers, TapInfo, } from "./gestures/types.js";
export { PanInfo } from "./gestures/PanSession.js";
export { useCycle } from "./utils/use-cycle.js";
export { transform } from "./utils/transform.js";
export { isValidMotionProp } from "./motion/utils/valid-prop.js";
export { usePresence, useIsPresent, } from "./components/AnimatePresence/use-presence.js";
export { useDragControls, DragControls, } from "./gestures/drag/use-drag-controls.js";
export { UseDomEvent } from "./events/use-dom-event.js";
export { createMotionComponent } from "./motion/index.js";
export { addScaleCorrection } from "./render/dom/projection/scale-correction.js";
export { snapshotViewportBox } from "./render/dom/projection/utils.js";
export { createCrossfader } from "./components/AnimateSharedLayout/utils/crossfader.js";
export { visualElement } from "./render/index.js";
export { VisualElement } from "./render/types.js";
export { batchLayout, flushLayout } from "./render/dom/utils/batch-layout.js";
/**
 * Contexts
 */
export { MotionConfigContext } from "./context/MotionConfigContext.js";
export { PresenceContext } from "./context/PresenceContext.js";
export { LayoutGroupContext } from "./context/LayoutGroupContext.js";
/**
 * Types
 */
export { HTMLMotionProps, ForwardRefComponent } from "./render/html/types.js";
export { SVGMotionProps, SVGAttributesAsMotionValues } from "./render/svg/types.js";
export { AnimationOptions, AnimationPlaybackControls, } from "./animation/animate.js";
export { CustomDomComponent } from "./render/dom/motion-proxy.js";
export { ScrollMotionValues } from "./value/scroll/utils.js";
export { AnimationProps, MotionProps, MotionAdvancedProps, MotionStyle, MotionTransform, VariantLabels, RelayoutInfo, ResolveLayoutTransition, } from "./motion/types.js";
export { Orchestration, Repeat, Tween, Spring, Keyframes, Inertia, None, EasingFunction, Target, TargetAndTransition, Transition, ResolvedKeyframesTarget, KeyframesTarget, CustomValueType, ResolvedSingleTarget, SingleTarget, ResolvedValueTarget, ValueTarget, Variant, Variants, } from "./types.js";
export { EventInfo } from "./events/types.js";
export { VisualElementLifecycles } from "./render/utils/lifecycles.js";
export * from "./motion/features/types.js";
export { DraggableProps, DragHandlers, DragElastic, } from "./gestures/drag/types.js";
export { LayoutProps } from "./motion/features/layout/types.js";
export { AnimatePresenceProps } from "./components/AnimatePresence/types.js";
export { SharedLayoutProps } from "./components/AnimateSharedLayout/types.js";
export { SharedLayoutAnimationConfig, VisibilityAction, SharedLayoutSyncMethods, SyncLayoutLifecycles, } from "./components/AnimateSharedLayout/types.js";
export { SharedLayoutContext } from "./context/SharedLayoutContext.js";
export { createBatcher } from "./components/AnimateSharedLayout/utils/batcher.js";
export * from "./types/geometry.js";
export { MotionConfigProps } from "./components/MotionConfig/index.js";
export { LazyProps } from "./components/LazyMotion/types.js";
export { FlatTree } from "./render/utils/flat-tree.js";