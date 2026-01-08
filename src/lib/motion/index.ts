/**
 * Motion for Svelte 5
 *
 * A runes-native animation library inspired by Framer Motion
 *
 * @example
 * ```svelte
 * <script>
 *   import { motion } from 'motion-start/motion';
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
 * ```
 */

// Core motion value
export { motionValue, motionTransform, motionCombine } from './core/motion-value.svelte.js';
export type { MotionValueState, MotionValueOptions } from './core/motion-value.svelte.js';

// Animation engine
export { animate, animateValues, createAnimationGenerator } from './animation/animate.js';
export { getEasingFunction, mirrorEasing, reverseEasing } from './animation/easing.js';
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
export { layout, layoutGroup, animateLayout, snapshotLayout } from './attachments/layout.svelte.js';
export { sharedLayout } from './attachments/shared-layout.svelte.js';
export type { PresenceProps } from './attachments/presence.svelte.js';
export type { LayoutProps } from './attachments/layout.svelte.js';
export type { SharedLayoutProps } from './attachments/shared-layout.svelte.js';

// Gestures
export { draggable, pan } from './gestures/drag.svelte.js';
export type { DragState, PanInfo, PanHandlers } from './gestures/drag.svelte.js';

// Context
export { setMotionConfig, getMotionConfig, prefersReducedMotion, getEffectiveTransition } from './context/motion-config.svelte.js';
export { createPresenceContext, getPresenceContext, usePresence, generatePresenceId } from './context/presence.svelte.js';
export { createSharedLayoutContext, getSharedLayoutContext } from './context/shared-layout.svelte.js';
export type { MotionConfigValue } from './context/motion-config.svelte.js';
export type { PresenceContextValue, PresenceState } from './context/presence.svelte.js';

// Components
export { default as MotionConfig } from './components/MotionConfig.svelte';
export { default as AnimatePresence } from './components/AnimatePresence.svelte';
export { default as SharedLayoutProvider } from './components/SharedLayoutProvider.svelte';
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
