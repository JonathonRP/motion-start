/**
 * motion-start - Svelte 5 animation library
 * Based on framer-motion@11.11.11 and compatible patterns
 * Copyright (c) 2018 Framer B.V. (original framer-motion)
 */

/**
 * ========================================
 * COMPONENTS
 * ========================================
 */
export { AnimatePresence } from "./components/AnimatePresence/index.js";
export { AnimateSharedLayout } from "./components/AnimateSharedLayout/index.js";
export { LazyMotion } from "./components/LazyMotion/index.js";
export { MotionConfig } from "./components/MotionConfig/index.js";
export { LayoutGroup } from "./components/LayoutGroup/index.js";
export { ReorderGroup, ReorderItem } from "./components/Reorder/index.js";
export {
  motion,
  createDomMotionComponent,
  motion as Motion,
} from "./render/dom/motion.js";
export { m, m as M } from "./render/dom/motion-minimal.js";
export { default as MotionSSR } from "./motion/MotionSSR.svelte";
export {
  default as Mdiv,
  default as MotionDiv,
} from "./components/MotionDiv.svelte";

/**
 * ========================================
 * ANIMATION & CONTROLS
 * ========================================
 */
export { animate } from "./animation/animate.js";
export { animationControls } from "./animation/animation-controls.js";
export { useAnimation, useAnimationControls } from "./animation/use-animation.js";
export { UseAnimation } from "./animation/use-animation.js";
export type { AnimationControls } from "./animation/types.js";

/**
 * ========================================
 * FEATURES
 * ========================================
 */
export {
  featureBundle,
  animations,
  drag,
  gestureAnimations,
} from "./render/dom/featureBundle.js";
/**
 * ========================================
 * MOTION VALUES & HOOKS
 * ========================================
 */
export {
  MotionValue,
  motionValue,
  type PassiveEffect,
  type Subscriber,
} from "./value/index.js";
export { useElementScroll } from "./value/scroll/use-element-scroll.js";
export { useViewportScroll } from "./value/scroll/use-viewport-scroll.js";
export { useScroll } from "./value/use-scroll.svelte.js";
export { useInView, useInViewWithCallback } from "./value/use-in-view.svelte.js";
export { useTime } from "./value/use-time.svelte.js";
export { useWillChange, addWillChange, removeWillChange } from "./value/use-will-change.svelte.js";
export { useAnimate } from "./value/use-animate.svelte.js";
export { useAnimationFrame } from "./value/use-animation-frame.svelte.js";
export { useMotionValueEvent } from "./value/use-motion-value-event.svelte.js";
export { useMotionTemplate } from "./value/use-motion-template.js";
export { useMotionValue } from "./value/use-motion-value.js";
export { useSpring } from "./value/use-spring.js";
export { useTransform } from "./value/use-transform.js";
export { useVelocity } from "./value/use-velocity.js";
export { resolveMotionValue } from "./value/utils/resolve-motion-value.js";

/**
 * ========================================
 * GESTURES & DRAG
 * ========================================
 */
export {
  DragControls,
  useDragControls,
} from "./gestures/drag/use-drag-controls.js";
export { UseGestures } from "./gestures/use-gestures.js";
export { UsePanGesture } from "./gestures/use-pan-gesture.js";
export { UseTapGesture } from "./gestures/use-tap-gesture.js";

/**
 * ========================================
 * UTILITIES
 * ========================================
 */
export { stagger, simpleStagger } from "./utils/stagger.js";
export { scroll, scrollAnimate } from "./utils/scroll.js";
export { inView, inViewAnimate, getInViewInfo } from "./utils/inView.js";
export { useCycle } from "./utils/use-cycle.svelte.js";
export { useReducedMotion } from "./utils/use-reduced-motion.svelte.js";
export {
  isBrowser,
  isServer,
  prefersReducedMotion,
  hasIntersectionObserver,
  hasRequestAnimationFrame
} from "./utils/environment.js";
export { UseDomEvent } from "./events/use-dom-event.js";
export {
  useIsPresent,
  usePresence,
} from "./components/AnimatePresence/use-presence.js";
export { createCrossfader } from "./components/AnimateSharedLayout/utils/crossfader.js";
export type {
  FocusHandlers,
  HoverHandlers,
  InViewHandlers,
  PanHandlers,
  TapHandlers,
  TapInfo,
  ViewportOptions,
} from "./gestures/types.js";
export type { InViewOptions } from "./utils/inView.js";
export type { ScrollOptions } from "./utils/scroll.js";
export { createMotionComponent } from "./motion/index.js";
export { isValidMotionProp } from "./motion/utils/valid-prop.js";
export { addScaleCorrection } from "./render/dom/projection/scale-correction.js";
export { snapshotViewportBox } from "./render/dom/projection/utils.js";
export { batchLayout, flushLayout } from "./render/dom/utils/batch-layout.js";
export { visualElement } from "./render/index.js";
export type { VisualElement } from "./render/types.js";
export { animateVisualElement } from "./render/utils/animation.js";
export { transform } from "./utils/transform.js";

/**
 * ========================================
 * CONTEXTS
 * ========================================
 */
export { FramerTreeLayoutContext } from "./context/SharedLayoutContext.js";
export { LayoutGroupContext } from "./context/LayoutGroupContext.js";
export { MotionConfigContext } from "./context/MotionConfigContext.js";
export { PresenceContext } from "./context/PresenceContext.js";

/**
 * ========================================
 * TYPES
 * ========================================
 */
export type { PanInfo } from "./gestures/PanSession.js";
export type {
  AnimationOptions,
  AnimationPlaybackControls,
} from "./animation/animate.js";
export type { AnimatePresenceProps, AnimatePresenceMode } from "./components/AnimatePresence/types.js";
export type {
  SharedLayoutAnimationConfig,
  SharedLayoutProps,
  SharedLayoutSyncMethods,
  SyncLayoutLifecycles,
  VisibilityAction,
} from "./components/AnimateSharedLayout/types.js";
export { createBatcher } from "./components/AnimateSharedLayout/utils/batcher.js";
export type { LazyProps } from "./components/LazyMotion/types.js";
export type { MotionConfigProps } from "./components/MotionConfig/index.js";
export type { SharedLayoutContext } from "./context/SharedLayoutContext.js";
export type { EventInfo } from "./events/types.js";
export type {
  DragElastic,
  DragHandlers,
  DraggableProps,
} from "./gestures/drag/types.js";
export type { LayoutProps } from "./motion/features/layout/types.js";
export * from "./motion/features/types.js";
export type {
  AnimationProps,
  MotionAdvancedProps,
  MotionProps,
  MotionStyle,
  MotionTransform,
  RelayoutInfo,
  ResolveLayoutTransition,
  VariantLabels,
} from "./motion/types.js";
export type { CustomDomComponent } from "./render/dom/motion-proxy.js";
// export type { ForwardRefComponent, HTMLMotionProps } from "./render/html/types.js";
// export type { SVGAttributesAsMotionValues, SVGMotionProps } from "./render/svg/types.js";
export { FlatTree } from "./render/utils/flat-tree.js";
export type { VisualElementLifecycles } from "./render/utils/lifecycles.js";
export type {
  CustomValueType,
  EasingFunction,
  Inertia,
  Keyframes,
  KeyframesTarget,
  None,
  Orchestration,
  Repeat,
  ResolvedKeyframesTarget,
  ResolvedSingleTarget,
  ResolvedValueTarget,
  SingleTarget,
  Spring,
  Target,
  TargetAndTransition,
  Transition,
  Tween,
  ValueTarget,
  Variant,
  Variants,
} from "./types.js";
export * from "./types/geometry.js";
export type { ScrollMotionValues } from "./value/scroll/utils.js";

export { animateLayout as layoutAnimation } from "./motion/features/layout/utils.js";
