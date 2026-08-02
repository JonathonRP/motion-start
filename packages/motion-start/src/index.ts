/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * Components
 */
export { AnimatePresence } from './components/AnimatePresence/index.js';
export { LayoutGroup } from './components/LayoutGroup/index.js';
export { LazyMotion } from './components/LazyMotion/index.js';
export { MotionConfig } from './components/MotionConfig/index.js';
export { Reorder } from './components/Reorder/index.js';
export { m } from './render/components/m/proxy.js';
export { motion } from './render/components/motion/proxy.js';

export * from './dom.js';
export * from './three-entry.js';

/**
 * Features
 */
export { domAnimation } from './render/dom/features-animation.js';
export { domMax } from './render/dom/features-max.js';
export { domMin } from './render/dom/features-min.js';

/**
 * Motion values
 */
export { useMotionValueEvent } from './utils/use-motion-value-event.svelte.js';
export { useElementScroll } from './value/scroll/use-element-scroll.js';
export { useViewportScroll } from './value/scroll/use-viewport-scroll.js';
export { useMotionTemplate } from './value/use-motion-template.js';
export { useMotionValue } from './value/use-motion-value.svelte.js';
export { useScroll, type UseScrollOptions } from './value/use-scroll.svelte.js';
export { useSpring } from './value/use-spring.js';
export { useTime } from './value/use-time.js';
export { useTransform } from './value/use-transform.js';
export { useVelocity } from './value/use-velocity.js';
export { useWillChange } from './value/use-will-change/index.js';
export { resolveMotionValue } from './value/utils/resolve-motion-value.js';

/**
 * Accessibility
 */
export { useReducedMotion } from './utils/reduced-motion/use-reduced-motion.js';
export { useReducedMotionConfig } from './utils/reduced-motion/use-reduced-motion-config.js';

/**
 * Utils
 */
export { AcceleratedAnimation } from './animation/animators/AcceleratedAnimation.js';
export { animateValue } from './animation/animators/MainThreadAnimation.js';
export { animationControls } from './animation/hooks/animation-controls.js';
export { useAnimateMini } from './animation/hooks/use-animate-style.js';
export { useAnimate } from './animation/hooks/use-animate.svelte.js';
export {
	useAnimation,
	useAnimationControls,
} from './animation/hooks/use-animation.svelte.js';
export { animateVisualElement } from './animation/interfaces/visual-element.js';
export { usePresenceData } from './components/AnimatePresence/use-presence-data.svelte.js';
export {
	useIsPresent,
	usePresence,
} from './components/AnimatePresence/use-presence.svelte.js';
export { useDomEvent } from './events/use-dom-event.svelte.js';
export {
	DragControls,
	useDragControls,
} from './gestures/drag/use-drag-controls.js';
export type { PanInfo } from './gestures/pan/PanSession.js';
export type {
	FocusHandlers,
	HoverHandlers,
	PanHandlers,
	TapHandlers,
	TapInfo,
} from './gestures/types.js';
export { createRendererMotionComponent } from './motion/index.svelte.js';
export { isMotionComponent } from './motion/utils/is-motion-component.js';
export { unwrapMotionComponent } from './motion/utils/unwrap-motion-component.js';
export { isValidMotionProp } from './motion/utils/valid-prop.js';
export { addScaleCorrector } from './projection/styles/scale-correction.js';
export { useInstantLayoutTransition } from './projection/use-instant-layout-transition.js';
export { useResetProjection } from './projection/use-reset-projection.js';
export { buildTransform } from './render/html/utils/build-transform.js';
export { visualElementStore } from './render/store.js';
export { VisualElement } from './render/VisualElement.svelte.js';
export { MotionGlobalConfig } from './utils/GlobalConfig.js';
export { useAnimationFrame } from './utils/use-animation-frame.svelte.js';
export { useCycle, type Cycle, type CycleState } from './utils/use-cycle.svelte.js';
export { useInView, type UseInViewOptions } from './utils/use-in-view.svelte.js';
export {
	disableInstantTransitions,
	useInstantTransition,
} from './utils/use-instant-transition.svelte.js';
export { color } from './value/types/color/index.js';
export { complex } from './value/types/complex/index.js';
export { px } from './value/types/numbers/units.js';
export type { ValueType } from './value/types/types.js';

/**
 * Appear animations
 */
export { spring } from './animation/generators/spring/index.js';
export { findSpring } from './animation/generators/spring/find.js';
export { optimizedAppearDataAttribute } from './animation/optimized-appear/data-id.js';
export { startOptimizedAppearAnimation } from './animation/optimized-appear/start.js';

/**
 * Contexts
 */
export type { LayoutGroupContext } from './context/LayoutGroupContext.svelte.js';
// export { MotionConfigContext } from './context/MotionConfigContext.svelte.js';
export type { MotionContext } from './context/MotionContext/index.js';
// export { PresenceContext } from './context/PresenceContext.svelte.js';
export type { SwitchLayoutGroupContext } from './context/SwitchLayoutGroupContext.js';

/**
 * Types
 */
export * from './animation/sequence/types.js';
export * from './animation/types.js';
export type { AnimatePresenceProps } from './components/AnimatePresence/types.js';
export type { LazyProps } from './components/LazyMotion/types.js';
export type { MotionConfigProps } from './components/MotionConfig/index.js';
export type { EventInfo } from './events/types.js';
export type {
	DragElastic,
	DraggableProps,
	DragHandlers,
} from './gestures/drag/types.js';
// NOTE: animateLayout cannot be exported from .svelte files in TypeScript
// It's a simple passthrough function: { track: (fn) => fn }
// export { animateLayout as layoutAnimation } from './motion/features/layout/MeasureLayout.svelte';
export type { LayoutProps } from './motion/features/layout/types.js';
export * from './motion/features/types.js';
export type {
	AnimationProps,
	MotionAdvancedProps,
	MotionProps,
	MotionStyle,
	MotionTransform,
	VariantLabels,
} from './motion/types.js';
export * from './projection/geometry/types.js';
export type { IProjectionNode } from './projection/node/types.js';
export type { DOMMotionComponents } from './render/dom/types.js';
export type { ForwardRefComponent, HTMLMotionProps } from './render/html/types.js';
export type { SVGAttributesAsMotionValues, SVGMotionProps } from './render/svg/types.js';
export type { AnimationLifecycles, CreateVisualElement } from './render/types.js';
export { FlatTree } from './render/utils/flat-tree.js';
export type {
	CustomValueType,
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
export type { ScrollMotionValues } from './value/scroll/utils.js';

/**
 * Deprecated
 */
export { useAnimatedState as useDeprecatedAnimatedState } from './animation/hooks/use-animated-state.svelte.js';
export { useDeprecatedLayoutGroupContext } from './context/DeprecatedLayoutGroupContext.js';
export { useInvertedScale as useDeprecatedInvertedScale } from './value/use-inverted-scale.js';

// Keep explict delay in milliseconds export for BC with Framer
export { delay, type DelayedFunction } from './utils/delay.js';

// extra utils
const animateLayout = {
	track: <A extends unknown[], R>(fn: (...args: A) => R) => {
		return fn;
	},
};
export { animateLayout as layoutAnimation };
