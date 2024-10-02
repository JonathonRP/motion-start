/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { CSSProperties } from 'react';
import type { AnimationControls } from '../animation/types';
import type { DraggableProps } from '../gestures/drag/types';
import type { FocusHandlers, HoverHandlers, PanHandlers, TapHandlers } from '../gestures/types';
import type { VisualElementLifecycles } from '../render/utils/lifecycles';
import type { MakeCustomValueType, Omit, Target, TargetAndTransition, Transition, Variants } from '../types';
import type { MotionValue } from '../value';
import type { LayoutProps } from './features/layout/types';

export type Ref<T> = (instance: T | null) => void | {
	current: T | null;
} | null;

export type MotionStyleProp = string | number | MotionValue;
/**
 * Either a string, or array of strings, that reference variants defined via the `variants` prop.
 * @public
 */
export type VariantLabels = string | string[];
export interface TransformProperties {
	x?: string | number;
	y?: string | number;
	z?: string | number;
	translateX?: string | number;
	translateY?: string | number;
	translateZ?: string | number;
	rotate?: string | number;
	rotateX?: string | number;
	rotateY?: string | number;
	rotateZ?: string | number;
	scale?: string | number;
	scaleX?: string | number;
	scaleY?: string | number;
	scaleZ?: string | number;
	skew?: string | number;
	skewX?: string | number;
	skewY?: string | number;
	originX?: string | number;
	originY?: string | number;
	originZ?: string | number;
	perspective?: string | number;
	transformPerspective?: string | number;
}
/**
 * @public
 */
export interface SVGPathProperties {
	pathLength?: number;
	pathOffset?: number;
	pathSpacing?: number;
}
export interface CustomStyles {
	/**
	 * Framer Library custom prop types. These are not actually supported in Motion - preferably
	 * we'd have a way of external consumers injecting supported styles into this library.
	 */
	size?: string | number;
	radius?: string | number;
	shadow?: string;
	image?: string;
}
export type MakeMotion<T> = MakeCustomValueType<{
	[K in keyof T]: T[K] | MotionValue<number> | MotionValue<string> | MotionValue<any>;
}>;
export type MotionCSS = MakeMotion<Omit<CSSProperties, 'rotate' | 'scale' | 'perspective'>>;
/**
 * @public
 */
export type MotionTransform = MakeMotion<TransformProperties>;

/**
 * @public
 */
export type MotionStyle = MotionCSS &
	MotionTransform &
	MakeMotion<SVGPathProperties> /* & MakeCustomValueType<CustomStyles>*/;
export type OnUpdate = (v: Target) => void;
/**
 * @public
 */
export interface RelayoutInfo {
	delta: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}
/**
 * @public
 */
export type ResolveLayoutTransition = (info: RelayoutInfo) => Transition | boolean;
/**
 * @public
 */
export interface AnimationProps {
	/**
	 * Values to animate to, variant label(s), or `AnimationControls`.
	 *
	 * @motion
	 *
	 * ```jsx
	 * // As values
	 * <MotionDiv animate={{ opacity: 1 }} />
	 *
	 * // As variant
	 * <MotionDiv animate="visible" variants={variants} />
	 *
	 * // Multiple variants
	 * <MotionDiv animate={["visible", "active"]} variants={variants} />
	 *
	 * // AnimationControls
	 * <MotionDiv animate={animation} />
	 * ```
	 */
	animate?: AnimationControls | TargetAndTransition | VariantLabels | boolean;
	/**
	 * A target to animate to when this component is removed from the tree.
	 *
	 * This component **must** be the first animatable child of an `AnimatePresence` to enable this exit animation.
	 *
	 * This limitation exists because React doesn't allow components to defer unmounting until after
	 * an animation is complete. Once this limitation is fixed, the `AnimatePresence` component will be unnecessary.
	 *
	 * @motion
	 *
	 * ```jsx
	 * import { AnimatePresence, motion } from 'svelte-motion'
	 *
	 *
	 * <AnimatePresence show={isVisible}>
	 *      <MotionDiv
	 *        initial={{ opacity: 0 }}
	 *        animate={{ opacity: 1 }}
	 *        exit={{ opacity: 0 }}
	 *      />
	 * </AnimatePresence>
	 * ```
	 */
	exit?: TargetAndTransition | VariantLabels;
	/**
	 * Variants allow you to define animation states and organise them by name. They allow
	 * you to control animations throughout a component tree by switching a single `animate` prop.
	 *
	 * Using `transition` options like `delayChildren` and `staggerChildren`, you can orchestrate
	 * when children animations play relative to their parent.
	 *
	 * @motion
	 *
	 * After passing variants to one or more `motion` component's `variants` prop, these variants
	 * can be used in place of values on the `animate`, `initial`, `whileFocus`, `whileTap` and `whileHover` props.
	 *
	 * ```jsx
	 * const variants = {
	 *   active: {
	 *       backgroundColor: "#f00"
	 *   },
	 *   inactive: {
	 *     backgroundColor: "#fff",
	 *     transition: { duration: 2 }
	 *   }
	 * }
	 *
	 * <MotionDiv variants={variants} animate="active" />
	 * ```
	 */
	variants?: Variants;
	/**
	 * Default transition. If no `transition` is defined in `animate`, it will use the transition defined here.
	 *
	 * @motion
	 *
	 * ```jsx
	 * const spring = {
	 *   type: "spring",
	 *   damping: 10,
	 *   stiffness: 100
	 * }
	 *
	 * <MotionDiv transition={spring} animate={{ scale: 1.2 }} />
	 * ```
	 */
	transition?: Transition;
}
/**
 * @public
 */
export interface MotionAdvancedProps {
	/**
	 * Custom data to use to resolve dynamic variants differently for each animating component.
	 *
	 * @motion
	 *
	 * ```jsx
	 * const variants = {
	 *   visible: (custom) => ({
	 *     opacity: 1,
	 *     transition: { delay: custom * 0.2 }
	 *   })
	 * }
	 *
	 * <MotionDiv custom={0} animate="visible" variants={variants} />
	 * <MotionDiv custom={1} animate="visible" variants={variants} />
	 * <MotionDiv custom={2} animate="visible" variants={variants} />
	 * ```
	 *
	 * @public
	 */
	custom?: any;
	/**
	 * @public
	 * Set to `false` to prevent inheriting variant changes from its parent.
	 */
	inherit?: boolean;
}
/**
 * Props for `motion` components.
 *
 * @public
 */
export interface MotionProps
	extends AnimationProps,
		VisualElementLifecycles,
		PanHandlers,
		TapHandlers,
		HoverHandlers,
		FocusHandlers,
		DraggableProps,
		LayoutProps,
		MotionAdvancedProps {
	transformValues?: any;
	/**
	 * Properties, variant label or array of variant labels to start in.
	 *
	 * Set to `false` to initialise with the values in `animate` (disabling the mount animation)
	 *
	 * @motion
	 *
	 * ```jsx
	 * // As values
	 * <MotionDiv initial={{ opacity: 1 }} />
	 *
	 * // As variant
	 * <MotionDiv initial="visible" variants={variants} />
	 *
	 * // Multiple variants
	 * <MotionDiv initial={["visible", "active"]} variants={variants} />
	 *
	 * // As false (disable mount animation)
	 * <MotionDiv initial={false} animate={{ opacity: 0 }} />
	 * ```
	 */
	initial?: boolean | Target | VariantLabels;
	/**
	 * @motion
	 *
	 * The React DOM `style` prop, enhanced with support for `MotionValue`s and separate `transform` values.
	 *
	 * ```jsx
	 * <script>
	 *   const x = useMotionValue(0)
	 * </script>
	 *
	 * <MotionDiv style={{ x, opacity: 1, scale: 0.5 }} />
	 * ```
	 */
	style?: MotionStyle;
	/**
	 * By default, Svelte Motion generates a `transform` property with a sensible transform order. `transformTemplate`
	 * can be used to create a different order, or to append/preprend the automatically generated `transform` property.
	 *
	 * @motion
	 *
	 * ```jsx
	 * <MotionDiv
	 *   style={{ x: 0, rotate: 180 }}
	 *   transformTemplate={
	 *     ({ x, rotate }) => `rotate(${rotate}deg) translateX(${x}px)`
	 *   }
	 * />
	 * ```
	 *
	 * @param transform - The latest animated transform props.
	 * @param generatedTransform - The transform string as automatically generated by Framer Motion
	 *
	 * @public
	 */
	transformTemplate?(transform: TransformProperties, generatedTransform: string): string;
}
export type TransformTemplate = (transform: TransformProperties, generatedTransform: string) => string;
