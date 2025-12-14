/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * Components
 */
export { AnimatePresence } from './components/AnimatePresence';
export { LayoutGroup } from './components/LayoutGroup';
export { LazyMotion } from './components/LazyMotion';
export { MotionConfig } from './components/MotionConfig';
export { Reorder } from './components/Reorder';
export { m } from './render/components/m/proxy';
export { motion } from './render/components/motion/proxy';

export * from './dom';
export * from './three-entry';

/**
 * Features
 */
export { domAnimation } from './render/dom/features-animation';
export { domMax } from './render/dom/features-max';
export { domMin } from './render/dom/features-min';

/**
 * Motion values
 */
export { useMotionValueEvent } from './utils/use-motion-value-event.svelte';
export { useElementScroll } from './value/scroll/use-element-scroll';
export { useViewportScroll } from './value/scroll/use-viewport-scroll';
export { useMotionTemplate } from './value/use-motion-template';
export { useMotionValue } from './value/use-motion-value.svelte';
export { useScroll, type UseScrollOptions } from './value/use-scroll';
export { useSpring } from './value/use-spring';
export { useTime } from './value/use-time';
export { useTransform } from './value/use-transform';
export { useVelocity } from './value/use-velocity';
export { useWillChange } from './value/use-will-change';
export { resolveMotionValue } from './value/utils/resolve-motion-value';

/**
 * Accessibility
 */
export { useReducedMotion } from './utils/reduced-motion/use-reduced-motion';
export { useReducedMotionConfig } from './utils/reduced-motion/use-reduced-motion-config';

/**
 * Utils
 */
export { AcceleratedAnimation } from './animation/animators/AcceleratedAnimation';
export { animateValue } from './animation/animators/MainThreadAnimation';
export { animationControls } from './animation/hooks/animation-controls';
export { useAnimateMini } from './animation/hooks/use-animate-style';
export { useAnimate } from './animation/hooks/use-animate.svelte';
export {
	useAnimation,
	useAnimationControls
} from './animation/hooks/use-animation.svelte';
export { animateVisualElement } from './animation/interfaces/visual-element';
export { usePresenceData } from './components/AnimatePresence/use-presence-data.svelte';
export {
	useIsPresent, usePresence
} from './components/AnimatePresence/use-presence.svelte';
export { useDomEvent } from './events/use-dom-event';
export {
	DragControls, useDragControls
} from './gestures/drag/use-drag-controls';
export type { PanInfo } from './gestures/pan/PanSession';
export type {
	FocusHandlers, HoverHandlers, PanHandlers, TapHandlers, TapInfo
} from './gestures/types';
export { createRendererMotionComponent } from './motion/index.svelte';
export { isMotionComponent } from './motion/utils/is-motion-component';
export { unwrapMotionComponent } from './motion/utils/unwrap-motion-component';
export { isValidMotionProp } from './motion/utils/valid-prop';
export { addScaleCorrector } from './projection/styles/scale-correction';
export { useInstantLayoutTransition } from './projection/use-instant-layout-transition';
export { useResetProjection } from './projection/use-reset-projection';
export { buildTransform } from './render/html/utils/build-transform';
export { visualElementStore } from './render/store';
export { VisualElement } from './render/VisualElement.svelte';
export { MotionGlobalConfig } from './utils/GlobalConfig';
export { useAnimationFrame } from './utils/use-animation-frame.svelte';
export { useCycle, type Cycle, type CycleState } from './utils/use-cycle.svelte';
export { useInView, type UseInViewOptions } from './utils/use-in-view.svelte';
export {
	disableInstantTransitions, useInstantTransition
} from './utils/use-instant-transition.svelte';
export { color } from './value/types/color';
export { complex } from './value/types/complex';
export { px } from './value/types/numbers/units';
export type { ValueType } from './value/types/types';

/**
 * Appear animations
 */
export { spring } from './animation/generators/spring';
export { findSpring } from './animation/generators/spring/find';
export { optimizedAppearDataAttribute } from './animation/optimized-appear/data-id';
export { startOptimizedAppearAnimation } from './animation/optimized-appear/start';

/**
 * Contexts
 */
export { LayoutGroupContext } from './context/LayoutGroupContext.svelte';
// export { MotionConfigContext } from './context/MotionConfigContext';
export { MotionContext } from './context/MotionContext';
// export { PresenceContext } from './context/PresenceContext';
export { SwitchLayoutGroupContext } from './context/SwitchLayoutGroupContext';

/**
 * Types
 */
export * from './animation/sequence/types';
export * from './animation/types';
export type { AnimatePresenceProps } from './components/AnimatePresence/types';
export type { LazyProps } from './components/LazyMotion/types';
export type { MotionConfigProps } from './components/MotionConfig';
export type { EventInfo } from './events/types';
export type {
	DragElastic, DraggableProps,
	DragHandlers
} from './gestures/drag/types';
export { animateLayout as layoutAnimation } from './motion/features/layout/MeasureLayout.svelte';
export type { LayoutProps } from './motion/features/layout/types';
export * from './motion/features/types';
export type {
	AnimationProps, MotionAdvancedProps, MotionProps, MotionStyle,
	MotionTransform,
	VariantLabels
} from './motion/types';
export * from './projection/geometry/types';
export type { IProjectionNode } from './projection/node/types';
export type { DOMMotionComponents } from './render/dom/types';
export type { ForwardRefComponent } from './render/html/types';
export type { SVGAttributesAsMotionValues, SVGMotionProps } from './render/svg/types';
export type { AnimationLifecycles, CreateVisualElement } from './render/types';
export { FlatTree } from './render/utils/flat-tree';
export type {
	CustomValueType, Inertia, Keyframes, KeyframesTarget, None, Orchestration,
	Repeat, ResolvedKeyframesTarget, ResolvedSingleTarget, ResolvedValueTarget, SingleTarget, Spring, Target,
	TargetAndTransition,
	Transition, Tween, ValueTarget,
	Variant,
	Variants
} from './types';
export type { ScrollMotionValues } from './value/scroll/utils';

/**
 * Deprecated
 */
export { useAnimatedState as useDeprecatedAnimatedState } from './animation/hooks/use-animated-state.svelte';
export { DeprecatedLayoutGroupContext } from './context/DeprecatedLayoutGroupContext';
export { useInvertedScale as useDeprecatedInvertedScale } from './value/use-inverted-scale';

// Keep explict delay in milliseconds export for BC with Framer
export { delay, type DelayedFunction } from './utils/delay';

