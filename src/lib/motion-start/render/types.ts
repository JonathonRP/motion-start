/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Component, Snippet } from 'svelte';
import type { startAnimation } from '../animation/utils/transitions';
import type { Presence, SharedLayoutAnimationConfig } from '../components/AnimateSharedLayout/types';
import type { Crossfader } from '../components/AnimateSharedLayout/utils/crossfader';
import type { MotionProps } from '../motion/types';
import type { VisualState } from '../motion/utils/use-visual-state';
import type { CustomValueType, MakeCustomValueType, TargetAndTransition, Transition, Variant } from '../types';
import type { AxisBox2D, Point2D } from '../types/geometry';
import type { MotionValue } from '../value';
import type { AnimationState } from './utils/animation-state';
import type { FlatTree } from './utils/flat-tree';
import type { LifecycleManager } from './utils/lifecycles.svelte';
import type { LayoutState, TargetProjection } from './utils/state';
import type {
	Booleanish,
	ClipboardEventHandler,
	CompositionEventHandler,
	DragEventHandler,
	EventHandler,
	FocusEventHandler,
	KeyboardEventHandler,
	MouseEventHandler,
	SVGAttributes,
	ToggleEventHandler,
} from 'svelte/elements';

export interface MotionPoint {
	x: MotionValue<number>;
	y: MotionValue<number>;
}
export interface VisualElement<Instance = any, RenderState = any> extends LifecycleManager {
	treeType: string;
	depth: number;
	parent?: VisualElement;
	children: Set<VisualElement>;
	variantChildren?: Set<VisualElement>;
	current: Instance | null;
	layoutTree: FlatTree;
	manuallyAnimateOnMount: boolean;
	blockInitialAnimation?: boolean;
	presenceId: number | undefined;
	projection: TargetProjection;
	isProjectionReady: () => boolean;
	isMounted(): boolean;
	mount(instance: Instance): void;
	unmount(): void;
	isStatic?: boolean;
	getInstance(): Instance | null;
	path: VisualElement[];
	sortNodePosition(element: VisualElement): number;
	addVariantChild(child: VisualElement): undefined | (() => void);
	getClosestVariantNode(): VisualElement | undefined;
	setCrossfader(crossfader: Crossfader): void;
	layoutSafeToRemove?: () => void;
	animateMotionValue?: typeof startAnimation;
	/**
	 * Visibility
	 */
	isVisible?: boolean;
	setVisibility(visibility: boolean): void;
	hasValue(key: string): boolean;
	addValue(key: string, value: MotionValue<any>): void;
	removeValue(key: string): void;
	getValue(key: string): undefined | MotionValue;
	getValue(key: string, defaultValue: string | number): MotionValue;
	getValue(key: string, defaultValue?: string | number): undefined | MotionValue;
	forEachValue(callback: (value: MotionValue, key: string) => void): void;
	readValue(key: string): string | number | undefined | null;
	setBaseTarget(key: string, value: string | number | null): void;
	getBaseTarget(key: string): number | string | undefined | null;
	getStaticValue(key: string): number | string | undefined;
	setStaticValue(key: string, value: number | string): void;
	getLatestValues(): ResolvedValues;
	scheduleRender(): void;
	setProps(props: MotionProps): void;
	getProps(): MotionProps;
	getVariant(name: string): Variant | undefined;
	getDefaultTransition(): Transition | undefined;
	getVariantContext(startAtParent?: boolean):
		| undefined
		| {
				initial?: string | string[];
				animate?: string | string[];
				exit?: string | string[];
				whileHover?: string | string[];
				whileDrag?: string | string[];
				whileFocus?: string | string[];
				whileTap?: string | string[];
		  };
	build(): RenderState;
	syncRender(): void;
	/**
	 * Layout projection - perhaps a candidate for lazy-loading
	 * or an external interface. Move into Projection?
	 */
	enableLayoutProjection(): void;
	lockProjectionTarget(): void;
	unlockProjectionTarget(): void;
	rebaseProjectionTarget(force?: boolean, sourceBox?: AxisBox2D): void;
	measureViewportBox(withTransform?: boolean): AxisBox2D;
	getLayoutState: () => LayoutState;
	getProjectionParent: () => VisualElement | false;
	getProjectionAnimationProgress(): MotionPoint;
	setProjectionTargetAxis(axis: 'x' | 'y', min: number, max: number, isRelative?: boolean): void;
	startLayoutAnimation(axis: 'x' | 'y', transition: Transition, isRelative: boolean): Promise<any>;
	stopLayoutAnimation(): void;
	updateLayoutProjection(): void;
	updateTreeLayoutProjection(): void;
	resolveRelativeTargetBox(): void;
	makeTargetAnimatable(target: TargetAndTransition, isLive?: boolean): TargetAndTransition;
	scheduleUpdateLayoutProjection(): void;
	notifyLayoutReady(config?: SharedLayoutAnimationConfig): void;
	pointTo(element: VisualElement): void;
	resetTransform(): void;
	restoreTransform(): void;
	shouldResetTransform(): boolean;
	isPresent: boolean;
	presence: Presence;
	isPresenceRoot?: boolean;
	prevDragCursor?: Point2D;
	prevViewportBox?: AxisBox2D;
	getLayoutId(): string | undefined;
	animationState?: AnimationState;
}
export interface VisualElementConfig<Instance, RenderState, Options> {
	treeType?: string;
	getBaseTarget?(props: MotionProps, key: string): string | number | undefined | MotionValue;
	build(
		visualElement: VisualElement<Instance>,
		renderState: RenderState,
		latestValues: ResolvedValues,
		projection: TargetProjection,
		layoutState: LayoutState,
		options: Options,
		props: MotionProps
	): void;
	sortNodePosition?: (a: Instance, b: Instance) => number;
	makeTargetAnimatable(
		element: VisualElement<Instance>,
		target: TargetAndTransition,
		props: MotionProps,
		isLive: boolean
	): TargetAndTransition;
	measureViewportBox(instance: Instance, options: Options): AxisBox2D;
	readValueFromInstance(instance: Instance, key: string, options: Options): string | number | null | undefined;
	resetTransform(element: VisualElement<Instance>, instance: Instance, props: MotionProps): void;
	restoreTransform(instance: Instance, renderState: RenderState): void;
	render(instance: Instance, renderState: RenderState): void;
	removeValueFromRenderState(key: string, renderState: RenderState): void;
	scrapeMotionValuesFromProps: ScrapeMotionValuesFromProps;
}
export type ScrapeMotionValuesFromProps = (props: MotionProps) => {
	[key: string]: MotionValue | string | number;
};
export type UseRenderState<RenderState = any> = () => RenderState;
export type VisualElementOptions<Instance, RenderState = any> = {
	visualState: VisualState<Instance, RenderState>;
	parent?: VisualElement<unknown>;
	variantParent?: VisualElement<unknown>;
	snapshot?: ResolvedValues;
	presenceId?: number | undefined;
	props: MotionProps;
	blockInitialAnimation?: boolean;
};
export type CreateVisualElement<Instance> = (
	Component: string | Component,
	options?: VisualElementOptions<Instance>
) => VisualElement<Instance>;
/**
 * A generic set of string/number values
 */
export interface ResolvedValues {
	[key: string]: string | number | CustomValueType | null | Booleanish | Snippet | MakeCustomValueType<any>;
}
