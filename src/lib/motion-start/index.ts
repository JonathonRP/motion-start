/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * Components
 */
export { motion } from './render/components/motion/proxy';
export { m } from './render/components/m/proxy';
export { AnimatePresence } from './components/AnimatePresence';
export { MotionConfig } from './components/MotionConfig';
export { LazyMotion } from './components/LazyMotion';
export { LayoutGroup } from './components/LayoutGroup';
export { Reorder } from './components/Reorder';

export * from './dom';
export * from './three-entry';

/**
 * Features
 */
export { domMin } from './render/dom/features-min';
export { domAnimation } from './render/dom/features-animation';
export { domMax } from './render/dom/features-max';

/**
 * Motion values
 */
export { useMotionValue } from './value/use-motion-value';
export { useMotionTemplate } from './value/use-motion-template';
export { resolveMotionValue } from './value/utils/resolve-motion-value';
export { useTransform } from './value/use-transform';
export { useSpring } from './value/use-spring';
export { useVelocity } from './value/use-velocity';
export { useScroll, type UseScrollOptions } from './value/use-scroll';
export { useElementScroll } from './value/scroll/use-element-scroll';
export { useViewportScroll } from './value/scroll/use-viewport-scroll';
export { useTime } from './value/use-time';
export { useWillChange } from './value/use-will-change';
export { useMotionValueEvent } from './utils/use-motion-value-event';

/**
 * Accessibility
 */
export { useReducedMotion } from './utils/reduced-motion/use-reduced-motion';
export { useReducedMotionConfig } from './utils/reduced-motion/use-reduced-motion-config';

/**
 * Utils
 */
export { animationControls } from './animation/hooks/animation-controls';
export { useAnimate } from './animation/hooks/use-animate';
export { useAnimateMini } from './animation/hooks/use-animate-style';
export {
	useAnimation,
	useAnimationControls,
} from './animation/hooks/use-animation';
export { useAnimationFrame } from './utils/use-animation-frame';
export { animateVisualElement } from './animation/interfaces/visual-element';
export type {
	HoverHandlers,
	TapHandlers,
	PanHandlers,
	FocusHandlers,
	TapInfo,
} from './gestures/types';
export type { PanInfo } from './gestures/pan/PanSession';
export { useCycle, type CycleState, type Cycle } from './utils/use-cycle';
export { isValidMotionProp } from './motion/utils/valid-prop';
export {
	usePresence,
	useIsPresent,
} from './components/AnimatePresence/use-presence';
export { useInView, type UseInViewOptions } from './utils/use-in-view';
export {
	useDragControls,
	DragControls,
} from './gestures/drag/use-drag-controls';
export { useDomEvent } from './events/use-dom-event';
export { createRendererMotionComponent } from './motion';
export { isMotionComponent } from './motion/utils/is-motion-component';
export { unwrapMotionComponent } from './motion/utils/unwrap-motion-component';
export { VisualElement } from './render/VisualElement';
export { addScaleCorrector } from './projection/styles/scale-correction';
export {
	useInstantTransition,
	disableInstantTransitions,
} from './utils/use-instant-transition';
export { useInstantLayoutTransition } from './projection/use-instant-layout-transition';
export { useResetProjection } from './projection/use-reset-projection';
export { buildTransform } from './render/html/utils/build-transform';
export { visualElementStore } from './render/store';
export { animateValue } from './animation/animators/MainThreadAnimation';
export { color } from './value/types/color';
export { complex } from './value/types/complex';
export { px } from './value/types/numbers/units';
export type { ValueType } from './value/types/types';
export { MotionGlobalConfig } from './utils/GlobalConfig';
export { AcceleratedAnimation } from './animation/animators/AcceleratedAnimation';

/**
 * Appear animations
 */
export { startOptimizedAppearAnimation } from './animation/optimized-appear/start';
export { optimizedAppearDataAttribute } from './animation/optimized-appear/data-id';
export { spring } from './animation/generators/spring';
export { findSpring } from './animation/generators/spring/find';

/**
 * Contexts
 */
export { MotionContext } from './context/MotionContext';
export { MotionConfigContext } from './context/MotionConfigContext';
export { PresenceContext } from './context/PresenceContext';
export { LayoutGroupContext } from './context/LayoutGroupContext';
export { SwitchLayoutGroupContext } from './context/SwitchLayoutGroupContext';

/**
 * Types
 */
export type { ForwardRefComponent } from './render/html/types';
export type { DOMMotionComponents } from './render/dom/types';
export type { SVGMotionProps, SVGAttributesAsMotionValues } from './render/svg/types';
export type { AnimationLifecycles } from './render/types';
export type { ScrollMotionValues } from './value/scroll/utils';
export type {
	AnimationProps,
	MotionProps,
	MotionAdvancedProps,
	MotionStyle,
	MotionTransform,
	VariantLabels,
} from './motion/types';
export type {
	Orchestration,
	Repeat,
	Tween,
	Spring,
	Keyframes,
	Inertia,
	None,
	Target,
	TargetAndTransition,
	Transition,
	ResolvedKeyframesTarget,
	KeyframesTarget,
	CustomValueType,
	ResolvedSingleTarget,
	SingleTarget,
	ResolvedValueTarget,
	ValueTarget,
	Variant,
	Variants,
} from './types';
export type { EventInfo } from './events/types';
export * from './motion/features/types';
export type {
	DraggableProps,
	DragHandlers,
	DragElastic,
} from './gestures/drag/types';
export type { LayoutProps } from './motion/features/layout/types';
export type { AnimatePresenceProps } from './components/AnimatePresence/types';
export type { MotionConfigProps } from './components/MotionConfig';
export type { LazyProps } from './components/LazyMotion/types';
export { FlatTree } from './render/utils/flat-tree';
export type { CreateVisualElement } from './render/types';
export * from './projection/geometry/types';
export type { IProjectionNode } from './projection/node/types';
export * from './animation/types';
export * from './animation/sequence/types';

/**
 * Deprecated
 */
export { DeprecatedLayoutGroupContext } from './context/DeprecatedLayoutGroupContext';
export { useAnimatedState as useDeprecatedAnimatedState } from './animation/hooks/use-animated-state';
export { useInvertedScale as useDeprecatedInvertedScale } from './value/use-inverted-scale';
export { AnimateSharedLayout } from './components/AnimateSharedLayout';

// Keep explict delay in milliseconds export for BC with Framer
export { delay, type DelayedFunction } from './utils/delay';
