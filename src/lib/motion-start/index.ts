/**
 * motion-start - Svelte 5 animation library
 * Based on framer-motion@11.11.11 and compatible patterns
 * Copyright (c) 2018 Framer B.V. (original framer-motion)
 */

export type {
	AnimationOptions,
	AnimationPlaybackControls,
} from './animation/animate.js';
/**
 * ========================================
 * ANIMATION & CONTROLS
 * ========================================
 */
export { animate } from './animation/animate.js';
export { animationControls } from './animation/animation-controls.js';
export type { AnimationControls, AnimationScope } from './animation/types.js';
export { useAnimation, useAnimationControls } from './animation/use-animation.js';
/**
 * ========================================
 * FRAMELOOP
 * ========================================
 */
export { frame, cancelFrame, frameData, frameSteps } from './frameloop/index.js';
export { microtask, cancelMicrotask } from './frameloop/microtask.js';
export { time } from './frameloop/sync-time.js';
export { stepsOrder } from './frameloop/batcher.js';
export type {
	Process,
	Schedule,
	Step,
	StepId,
	FrameData,
	Batcher,
	Steps,
} from './frameloop/types.js';
/**
 * ========================================
 * COMPONENTS
 * ========================================
 */
export { AnimatePresence } from './components/AnimatePresence/index.js';
export type { AnimatePresenceMode, AnimatePresenceProps } from './components/AnimatePresence/types.js';
export {
	useIsPresent,
	usePresence,
} from './components/AnimatePresence/use-presence.js';
export { AnimateSharedLayout } from './components/AnimateSharedLayout/index.js';
export type {
	SharedLayoutAnimationConfig,
	SharedLayoutProps,
	SharedLayoutSyncMethods,
	SyncLayoutLifecycles,
	VisibilityAction,
} from './components/AnimateSharedLayout/types.js';
export { createBatcher } from './components/AnimateSharedLayout/utils/batcher.js';
export { createCrossfader } from './components/AnimateSharedLayout/utils/crossfader.js';
export { LayoutGroup } from './components/LayoutGroup/index.js';
export { LazyMotion } from './components/LazyMotion/index.js';
export type { LazyProps } from './components/LazyMotion/types.js';
export type { MotionConfigProps } from './components/MotionConfig/index.js';
export { MotionConfig } from './components/MotionConfig/index.js';
export {
	default as Mdiv,
	default as MotionDiv,
} from './components/MotionDiv.svelte';
export { ReorderGroup, ReorderItem } from './components/Reorder/index.js';
export { LayoutGroupContext } from './context/LayoutGroupContext.js';
export { MotionConfigContext } from './context/MotionConfigContext.js';
export { PresenceContext } from './context/PresenceContext.js';
export type { SharedLayoutContext } from './context/SharedLayoutContext.js';
/**
 * ========================================
 * CONTEXTS
 * ========================================
 */
export { FramerTreeLayoutContext } from './context/SharedLayoutContext.js';
export type { EventInfo } from './events/types.js';
export { UseDomEvent } from './events/use-dom-event.js';
export type {
	DragElastic,
	DraggableProps,
	DragHandlers,
} from './gestures/drag/types.js';
/**
 * ========================================
 * GESTURES & DRAG
 * ========================================
 */
export {
	DragControls,
	useDragControls,
} from './gestures/drag/use-drag-controls.js';
/**
 * ========================================
 * TYPES
 * ========================================
 */
export type { PanInfo } from './gestures/PanSession.js';
export type {
	FocusHandlers,
	HoverHandlers,
	InViewHandlers,
	PanHandlers,
	TapHandlers,
	TapInfo,
	ViewportOptions,
} from './gestures/types.js';
export { UseGestures } from './gestures/use-gestures.js';
export { UsePanGesture } from './gestures/use-pan-gesture.js';
export { UseTapGesture } from './gestures/use-tap-gesture.js';
export type { LayoutProps } from './motion/features/layout/types.js';
export { animateLayout as layoutAnimation } from './motion/features/layout/utils.js';
export * from './motion/features/types.js';
export { createMotionComponent } from './motion/index.js';
export { default as MotionSSR } from './motion/MotionSSR.svelte';
export type {
	AnimationProps,
	MotionAdvancedProps,
	MotionProps,
	MotionStyle,
	MotionTransform,
	RelayoutInfo,
	ResolveLayoutTransition,
	VariantLabels,
} from './motion/types.js';
export { isValidMotionProp } from './motion/utils/valid-prop.js';
/**
 * ========================================
 * FEATURES
 * ========================================
 */
export {
	animations,
	drag,
	featureBundle,
	gestureAnimations,
} from './render/dom/featureBundle.js';
export {
	createDomMotionComponent,
	motion,
	motion as Motion,
} from './render/dom/motion.js';
export { m, m as M } from './render/dom/motion-minimal.js';
export type { CustomDomComponent } from './render/dom/motion-proxy.js';
export { addScaleCorrection } from './projection/utils/scale-correction.js';
export { snapshotViewportBox } from './projection/utils/projection-utils.js';
export { batchLayout, flushLayout } from './render/dom/utils/batch-layout.js';
export { visualElement } from './render/index.js';
export type { VisualElement } from './render/types.js';
export { animateVisualElement } from './render/utils/animation.js';
// export type { ForwardRefComponent, HTMLMotionProps } from "./render/html/types.js";
// export type { SVGAttributesAsMotionValues, SVGMotionProps } from "./render/svg/types.js";
export { FlatTree } from './render/utils/flat-tree.js';
export type { VisualElementLifecycles } from './render/utils/lifecycles.js';
export * from './types/geometry.js';
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
} from './types.js';
export {
	hasIntersectionObserver,
	hasRequestAnimationFrame,
	isBrowser,
	isServer,
	prefersReducedMotion,
} from './utils/environment.js';
export type { InViewOptions } from './utils/inView.js';
export { getInViewInfo, inView, inViewAnimate } from './utils/inView.js';
export type { ScrollOptions } from './utils/scroll.js';
export { scroll, scrollAnimate } from './utils/scroll.js';
/**
 * ========================================
 * UTILITIES
 * ========================================
 */
export { simpleStagger, stagger } from './utils/stagger.js';
export { transform } from './utils/transform.js';
export { useCycle } from './utils/use-cycle.svelte.js';
export { useReducedMotion } from './utils/use-reduced-motion.svelte.js';
export { useReducedMotionConfig } from './utils/use-reduced-motion-config.svelte.js';
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
} from './value/index.js';
export { useElementScroll } from './value/scroll/use-element-scroll.js';
export { useViewportScroll } from './value/scroll/use-viewport-scroll.js';
export type { ScrollMotionValues } from './value/scroll/utils.js';
export { useAnimate } from './value/use-animate.svelte.js';
export { useAnimationFrame } from './value/use-animation-frame.svelte.js';
export { useInView, useInViewWithCallback } from './value/use-in-view.svelte.js';
export { useMotionTemplate } from './value/use-motion-template.js';
export { useMotionValue } from './value/use-motion-value.js';
export { useMotionValueEvent } from './value/use-motion-value-event.svelte.js';
export { useScroll } from './value/use-scroll.svelte.js';
export { useSpring } from './value/use-spring.js';
export { useTime } from './value/use-time.svelte.js';
export { useTransform } from './value/use-transform.js';
export { useVelocity } from './value/use-velocity.js';
export { addWillChange, removeWillChange, useWillChange } from './value/use-will-change.svelte.js';
export { resolveMotionValue } from './value/utils/resolve-motion-value.js';
