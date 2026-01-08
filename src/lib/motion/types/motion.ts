/**
 * Motion Types
 *
 * Type definitions for motion props, variants, and animation targets
 */

import type { TransitionOptions } from '../animation/types.js';

/**
 * CSS transform properties that can be animated
 */
export type TransformProperties = {
	x?: number | string;
	y?: number | string;
	z?: number | string;
	rotateX?: number | string;
	rotateY?: number | string;
	rotateZ?: number | string;
	rotate?: number | string;
	scaleX?: number;
	scaleY?: number;
	scaleZ?: number;
	scale?: number;
	skewX?: number | string;
	skewY?: number | string;
	originX?: number | string;
	originY?: number | string;
	originZ?: number | string;
	perspective?: number | string;
};

/**
 * CSS properties that can be animated
 */
export type StyleProperties = {
	opacity?: number;
	backgroundColor?: string;
	color?: string;
	borderColor?: string;
	borderRadius?: number | string;
	borderWidth?: number | string;
	width?: number | string;
	height?: number | string;
	minWidth?: number | string;
	minHeight?: number | string;
	maxWidth?: number | string;
	maxHeight?: number | string;
	padding?: number | string;
	paddingTop?: number | string;
	paddingRight?: number | string;
	paddingBottom?: number | string;
	paddingLeft?: number | string;
	margin?: number | string;
	marginTop?: number | string;
	marginRight?: number | string;
	marginBottom?: number | string;
	marginLeft?: number | string;
	top?: number | string;
	right?: number | string;
	bottom?: number | string;
	left?: number | string;
	boxShadow?: string;
	textShadow?: string;
	filter?: string;
	backdropFilter?: string;
	clipPath?: string;
	outline?: string;
	outlineOffset?: number | string;
	gap?: number | string;
	gridTemplateColumns?: string;
	gridTemplateRows?: string;
	flexGrow?: number;
	flexShrink?: number;
	flexBasis?: number | string;
	zIndex?: number;
	pathLength?: number;
	pathOffset?: number;
	strokeDasharray?: string;
	strokeDashoffset?: number | string;
	strokeWidth?: number | string;
	fill?: string;
	stroke?: string;
};

/**
 * All animatable properties
 */
export type AnimatableProperties = TransformProperties & StyleProperties;

/**
 * Target for animation (values to animate to)
 */
export type AnimationTarget = AnimatableProperties & {
	transition?: TransitionOptions;
};

/**
 * Variant definition
 */
export type Variant = AnimationTarget | ((custom?: any) => AnimationTarget);

/**
 * Variants object - named animation states
 */
export type Variants = {
	[key: string]: Variant;
};

/**
 * Variant labels for animate prop
 */
export type VariantLabels = string | string[];

/**
 * Orchestration options for variants
 */
export type Orchestration = {
	/** Delay before starting children animations (seconds) */
	delayChildren?: number;
	/** Stagger delay between children (seconds) */
	staggerChildren?: number;
	/** Direction of stagger */
	staggerDirection?: 1 | -1;
	/** When to start children: 'beforeParent' | 'afterParent' */
	when?: 'beforeParent' | 'afterParent' | false;
};

/**
 * Transition with orchestration
 */
export type VariantTransition = TransitionOptions & Orchestration;

/**
 * Motion props for the motion attachment
 */
export type MotionProps = {
	/** Initial animation state (no animation on mount) */
	initial?: AnimationTarget | VariantLabels | false;

	/** Animate to this state */
	animate?: AnimationTarget | VariantLabels;

	/** Exit animation state */
	exit?: AnimationTarget | VariantLabels;

	/** Named animation states */
	variants?: Variants;

	/** Animate while hovering */
	whileHover?: AnimationTarget | VariantLabels;

	/** Animate while pressed/tapping */
	whileTap?: AnimationTarget | VariantLabels;

	/** Animate while focused */
	whileFocus?: AnimationTarget | VariantLabels;

	/** Animate while dragging */
	whileDrag?: AnimationTarget | VariantLabels;

	/** Animate while in view */
	whileInView?: AnimationTarget | VariantLabels;

	/** Default transition for all animations */
	transition?: TransitionOptions;

	/** Custom data passed to dynamic variants */
	custom?: any;

	/** Inherit variant changes from parent */
	inherit?: boolean;

	/** Callback when animation starts */
	onAnimationStart?: (definition: AnimationTarget | VariantLabels) => void;

	/** Callback when animation completes */
	onAnimationComplete?: (definition: AnimationTarget | VariantLabels) => void;

	/** Callback when hover starts */
	onHoverStart?: (event: PointerEvent) => void;

	/** Callback when hover ends */
	onHoverEnd?: (event: PointerEvent) => void;

	/** Callback when tap/press starts */
	onTapStart?: (event: PointerEvent) => void;

	/** Callback when tap/press ends */
	onTap?: (event: PointerEvent) => void;

	/** Callback when tap is cancelled */
	onTapCancel?: (event: PointerEvent) => void;

	/** Callback when focus starts */
	onFocusStart?: (event: FocusEvent) => void;

	/** Callback when focus ends */
	onFocusEnd?: (event: FocusEvent) => void;

	/** IntersectionObserver options for whileInView */
	viewport?: {
		root?: Element | null;
		margin?: string;
		amount?: 'some' | 'all' | number;
		once?: boolean;
	};

	/** Callback when element enters viewport */
	onViewportEnter?: (entry: IntersectionObserverEntry) => void;

	/** Callback when element leaves viewport */
	onViewportLeave?: (entry: IntersectionObserverEntry) => void;
};

/**
 * Drag props
 */
export type DragProps = {
	/** Enable drag */
	drag?: boolean | 'x' | 'y';

	/** Constraints for dragging */
	dragConstraints?: { top?: number; right?: number; bottom?: number; left?: number } | { current: HTMLElement };

	/** Elasticity when dragging outside constraints (0-1) */
	dragElastic?: number | { top?: number; right?: number; bottom?: number; left?: number };

	/** Momentum after release */
	dragMomentum?: boolean;

	/** Transition for drag release */
	dragTransition?: TransitionOptions;

	/** Lock drag to initial direction */
	dragDirectionLock?: boolean;

	/** Propagate drag to parent */
	dragPropagation?: boolean;

	/** Snap to origin on release */
	dragSnapToOrigin?: boolean;

	/** Callback when drag starts */
	onDragStart?: (event: PointerEvent, info: DragInfo) => void;

	/** Callback during drag */
	onDrag?: (event: PointerEvent, info: DragInfo) => void;

	/** Callback when drag ends */
	onDragEnd?: (event: PointerEvent, info: DragInfo) => void;

	/** Callback when direction is locked */
	onDirectionLock?: (axis: 'x' | 'y') => void;
};

/**
 * Drag info passed to callbacks
 */
export type DragInfo = {
	point: { x: number; y: number };
	delta: { x: number; y: number };
	offset: { x: number; y: number };
	velocity: { x: number; y: number };
};

/**
 * Layout animation props
 */
export type LayoutProps = {
	/** Enable layout animations */
	layout?: boolean | 'position' | 'size';

	/** Shared layout ID for cross-component animations */
	layoutId?: string;

	/** Transition for layout animations */
	layoutTransition?: TransitionOptions;

	/** Callback when layout animation starts */
	onLayoutAnimationStart?: () => void;

	/** Callback when layout animation completes */
	onLayoutAnimationComplete?: () => void;
};

/**
 * All motion attachment props
 */
export type MotionAttachmentProps = MotionProps & DragProps & LayoutProps;
