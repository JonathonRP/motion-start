/**
 * Motion for Svelte 5
 *
 * A runes-native animation library inspired by Framer Motion
 * Uses Svelte 5's createContext API and attachments
 *
 * @example
 * ```svelte
 * <script>
 *   import { motion, layout } from 'motion-start/motion';
 * </script>
 *
 * <div {@attach motion({
 *   initial: { opacity: 0, y: 20 },
 *   animate: { opacity: 1, y: 0 },
 *   whileHover: { scale: 1.05 },
 *   transition: { type: 'spring' }
 * })}>
 *   Animated content
 * </div>
 *
 * <!-- Shared element transition -->
 * <div {@attach layout({ layoutId: 'hero' })}>
 *   This transitions to another element with same layoutId
 * </div>
 * ```
 */

// Core motion value
export { motionValue, motionTransform, motionCombine } from './core/motion-value.svelte.js';
export type { MotionValueState, MotionValueOptions } from './core/motion-value.svelte.js';

// Spring animation (built on Svelte's Spring + physics-based)
export {
	// Svelte-based (normalized 0-1 params)
	spring,
	springFrom,
	springObject,
	SvelteSpring,
	// Physics-based (stiffness ~100-500, damping ~10-30)
	physicsSpring,
	physicsSpringFrom,
	momentumSpring,
	springWithMomentum // alias for momentumSpring
} from './core/spring.svelte.js';
export type {
	SpringOptions as SpringAnimationOptions,
	SpringValue,
	PhysicsSpringOptions,
	PhysicsSpringValue,
	MomentumSpringOptions,
	MomentumSpringValue
} from './core/spring.svelte.js';

// Tween animation (built on Svelte's Tween)
export {
	tween,
	tweenFrom,
	tweenObject,
	tweenColor,
	SvelteTween
} from './core/tween.svelte.js';
export type { TweenOptions as TweenAnimationOptions, TweenValue } from './core/tween.svelte.js';

// Easing functions (re-exported from svelte/easing with extensions)
export {
	// All Svelte easings
	linear,
	sineIn,
	sineOut,
	sineInOut,
	quadIn,
	quadOut,
	quadInOut,
	cubicIn,
	cubicOut,
	cubicInOut,
	quartIn,
	quartOut,
	quartInOut,
	quintIn,
	quintOut,
	quintInOut,
	expoIn,
	expoOut,
	expoInOut,
	circIn,
	circOut,
	circInOut,
	backIn,
	backOut,
	backInOut,
	elasticIn,
	elasticOut,
	elasticInOut,
	bounceIn,
	bounceOut,
	bounceInOut,
	// Composition utilities
	getEasingFunction,
	mirrorEasing,
	reverseEasing,
	sequenceEasing,
	blendEasing,
	clampEasing,
	scaleEasing
} from './animation/easing.js';
export type { EasingFunction } from './animation/easing.js';

// Animation engine
export { animate, animateValues, createAnimationGenerator } from './animation/animate.js';
export type {
	TransitionOptions,
	SpringOptions,
	TweenOptions,
	InertiaOptions,
	KeyframeOptions,
	Easing,
	AnimationPlaybackControls
} from './animation/types.js';

// Attachments
export { motion, createMotion } from './attachments/motion.svelte.js';
export { presence, triggerExit, hasExitAnimation } from './attachments/presence.svelte.js';
export {
	layout,
	layoutGroup,
	createLayoutBatch,
	animateLayoutElement,
	snapshotLayout
} from './attachments/layout.svelte.js';
export type { PresenceProps } from './attachments/presence.svelte.js';
export type { LayoutProps } from './attachments/layout.svelte.js';

// Gestures
export { draggable, pan } from './gestures/drag.svelte.js';
export type { DragState, PanInfo, PanHandlers } from './gestures/drag.svelte.js';

// Hooks (modern API, leveraging Svelte's Spring/Tween)
export {
	useAnimate,
	useInView,
	useReducedMotion,
	useDragControls,
	useMotionValue,
	useTransform,
	useSpring, // Svelte-based (0-1 params)
	usePhysicsSpring, // Physics-based (stiffness ~100-500)
	useTween
} from './hooks/index.svelte.js';

// Context (using Svelte 5 createContext API)
export {
	setMotionConfig,
	getMotionConfig,
	prefersReducedMotion,
	getEffectiveTransition
} from './context/motion-config.svelte.js';
export {
	createPresenceState,
	getPresenceContext,
	setPresenceContext,
	usePresenceContext,
	usePresence,
	generatePresenceId
} from './context/presence.svelte.js';
export {
	createLayoutGroupState,
	getLayoutGroupContext,
	setLayoutGroupContext,
	useLayoutGroupContext,
	registerLayoutElement,
	unregisterLayoutElement
} from './context/layout-group.svelte.js';
export type { MotionConfigValue } from './context/motion-config.svelte.js';
export type { PresenceContextValue, PresenceState } from './context/presence.svelte.js';
export type { LayoutGroupContextValue } from './context/layout-group.svelte.js';

// Components
export { default as MotionConfig } from './components/MotionConfig.svelte';
export { default as AnimatePresence } from './components/AnimatePresence.svelte';
export { default as LayoutGroup } from './components/LayoutGroup.svelte';
export { default as Reorder } from './components/Reorder.svelte';
export { default as ReorderItem } from './components/ReorderItem.svelte';

// Types
export type {
	MotionProps,
	DragProps,
	LayoutProps as MotionLayoutProps,
	AnimationTarget,
	Variant,
	Variants,
	VariantLabels,
	Orchestration,
	VariantTransition,
	DragInfo,
	TransformProperties,
	StyleProperties,
	AnimatableProperties,
	MotionAttachmentProps
} from './types/motion.js';

// Utilities
export {
	buildTransform,
	buildTransformOrigin,
	splitProperties,
	isTransformKey,
	formatStyleValue,
	parseValue,
	getDefaultUnit,
	camelToKebab,
	transformKeys
} from './utils/transforms.js';

export {
	resolveVariant,
	resolveVariantLabels,
	isVariantLabel,
	getAnimationTarget,
	targetsEqual,
	getChangedProperties,
	mergeTargets
} from './utils/variants.js';

// Scroll utilities
export { useScroll, useScrollProgress, scrollAnimation } from './utils/scroll.svelte.js';
export type { ScrollInfo, ScrollOptions } from './utils/scroll.svelte.js';
