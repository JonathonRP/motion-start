/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

export { VisibilityAction } from './components/AnimateSharedLayout/types.js';
export { MotionValue, motionValue } from './value/index.js';
export { MotionConfig } from "./components/MotionConfig/index.js"
export { animateVisualElement } from './render/utils/animation.js';
export { animationControls } from './animation/animation-controls.js';
export { addScaleCorrection } from './render/dom/projection/scale-correction.js';
export { visualElement } from './render/index.js';
export { isValidMotionProp } from './motion/utils/valid-prop.js';
export { MotionConfigContext } from './context/MotionConfigContext.js';
export { PresenceContext } from './context/PresenceContext.js';
export { useIsPresent, usePresence } from './components/AnimatePresence/use-presence.js';
export { LayoutGroupContext } from './context/LayoutGroupContext.js';
export { createBatcher } from './components/AnimateSharedLayout/utils/batcher.js';
export { FramerTreeLayoutContext, SharedLayoutContext } from './context/SharedLayoutContext.js';
export { createMotionComponent } from './motion/index.js';
export { UseDomEvent } from './events/use-dom-event.js';

export { UsePanGesture } from './gestures/use-pan-gesture.js';
export { UseTapGesture } from './gestures/use-tap-gesture.js';
export { UseGestures } from './gestures/use-gestures.js';

export { Motion } from './render/dom/motion.js';
export { M } from './render/dom/motion-proxy.js';
export { default as MotionSSR } from './motion/MotionSSR.svelte';

export { AnimatePresence } from './components/AnimatePresence/index.js';
export { animate } from './animation/animate.js';
export { createCrossfader } from './components/AnimateSharedLayout/utils/crossfader.js';
export { AnimateSharedLayout } from './components/AnimateSharedLayout/index.js';
export { useMotionValue } from './value/use-motion-value.js';
export { useMotionTemplate } from './value/use-motion-template.js';
export { resolveMotionValue } from './value/utils/resolve-motion-value.js';
export { transform } from './utils/transform.js';
export { useTransform } from './value/use-transform.js';
export { useSpring } from './value/use-spring.js';
export { useElementScroll } from './value/scroll/use-element-scroll.js';
export { useViewportScroll } from './value/scroll/use-viewport-scroll.js';
export { useReducedMotion } from './utils/use-reduced-motion.js';
export { UseAnimation, useAnimation } from './animation/use-animation.js';
export { useCycle } from './utils/use-cycle.js';
export { DragControls, useDragControls } from './gestures/drag/use-drag-controls.js';
export { useVelocity } from './value/use-velocity.js';

export {default as Mdiv, default as MotionDiv} from './components/MotionDiv.svelte';

// ----------------------------------------------------------------------------------------------

/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Components
 */
export { Motion/*, createDomMotionComponent*/, M, Motion as MotionSVG } from "./render/dom/motion";
//export { m } from "./render/dom/motion-minimal";
export { AnimatePresence } from "./components/AnimatePresence";
export { AnimateSharedLayout } from "./components/AnimateSharedLayout";
export { MotionConfig } from "./components/MotionConfig";
export { LazyMotion } from "./components/LazyMotion";
/**
 * Features
 */
export { domAnimation } from "./render/dom/features-animation";
export { domMax } from "./render/dom/features-max";
/**
 * Motion values
 */
export { useMotionValue } from "./value/use-motion-value";
export { useMotionTemplate } from "./value/use-motion-template";
export { MotionValue, motionValue, PassiveEffect, Subscriber } from "./value";
export { resolveMotionValue } from "./value/utils/resolve-motion-value";
export { useTransform } from "./value/use-transform";
export { useSpring } from "./value/use-spring";
export { useVelocity } from "./value/use-velocity";
export { useElementScroll } from "./value/scroll/use-element-scroll";
export { useViewportScroll } from "./value/scroll/use-viewport-scroll";
/**
 * Accessibility
 */
export { useReducedMotion } from "./utils/use-reduced-motion";
/**
 * Utils
 */
export { animationControls } from "./animation/animation-controls";
export { AnimationControls } from "./animation/types";
export { useAnimation } from "./animation/use-animation";
export { animate } from "./animation/animate";
export { animateVisualElement } from "./render/utils/animation";
export { HoverHandlers, TapHandlers, PanHandlers, FocusHandlers, TapInfo, } from "./gestures/types";
export { PanInfo } from "./gestures/PanSession";
export { useCycle } from "./utils/use-cycle";
export { transform } from "./utils/transform";
export { isValidMotionProp } from "./motion/utils/valid-prop";
export { usePresence, useIsPresent, } from "./components/AnimatePresence/use-presence";
export { useDragControls, DragControls, } from "./gestures/drag/use-drag-controls";
export { UseDomEvent } from "./events/use-dom-event";
export { createMotionComponent } from "./motion";
export { addScaleCorrection } from "./render/dom/projection/scale-correction";
export { snapshotViewportBox } from "./render/dom/projection/utils";
export { createCrossfader } from "./components/AnimateSharedLayout/utils/crossfader";
export { visualElement } from "./render";
export { VisualElement } from "./render/types";
export { batchLayout, flushLayout } from "./render/dom/utils/batch-layout";
/**
 * Contexts
 */
export { MotionConfigContext } from "./context/MotionConfigContext";
export { PresenceContext } from "./context/PresenceContext";
export { LayoutGroupContext } from "./context/LayoutGroupContext";
/**
 * Types
 */
export { HTMLMotionProps, ForwardRefComponent } from "./render/html/types";
export { SVGMotionProps, SVGAttributesAsMotionValues } from "./render/svg/types";
export { AnimationOptions, AnimationPlaybackControls, } from "./animation/animate";
export { CustomDomComponent } from "./render/dom/motion-proxy";
export { ScrollMotionValues } from "./value/scroll/utils";
export { AnimationProps, MotionProps, MotionAdvancedProps, MotionStyle, MotionTransform, VariantLabels, RelayoutInfo, ResolveLayoutTransition, } from "./motion/types";
export { Orchestration, Repeat, Tween, Spring, Keyframes, Inertia, None, EasingFunction, Target, TargetAndTransition, Transition, ResolvedKeyframesTarget, KeyframesTarget, CustomValueType, ResolvedSingleTarget, SingleTarget, ResolvedValueTarget, ValueTarget, Variant, Variants, } from "./types";
export { EventInfo } from "./events/types";
export { VisualElementLifecycles } from "./render/utils/lifecycles";
export * from "./motion/features/types";
export { DraggableProps, DragHandlers, DragElastic, } from "./gestures/drag/types";
export { LayoutProps } from "./motion/features/layout/types";
export { AnimatePresenceProps } from "./components/AnimatePresence/types";
export { SharedLayoutProps } from "./components/AnimateSharedLayout/types";
export { SharedLayoutAnimationConfig, VisibilityAction, SharedLayoutSyncMethods, SyncLayoutLifecycles, } from "./components/AnimateSharedLayout/types";
export { SharedLayoutContext } from "./context/SharedLayoutContext";
export { createBatcher } from "./components/AnimateSharedLayout/utils/batcher";
export * from "./types/geometry";
export { MotionConfigProps } from "./components/MotionConfig";
export { LazyProps } from "./components/LazyMotion/types";
export { FlatTree } from "./render/utils/flat-tree";