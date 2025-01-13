/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Transition } from '../../types';
import type { ResolvedValues } from '../../render/types';
import type { Point, Box, Delta } from '../geometry/types';
import type { NodeStack } from '../shared/stack';
import type { AnimationPlaybackControls } from '../../animation/types';
import type { FlatTree } from '../../render/utils/flat-tree';
import type { InitialPromotionConfig } from '../../context/SwitchLayoutGroupContext';
import type { MotionStyle } from '../../motion/types';
import type { VisualElement } from '../../render/VisualElement';

export interface Measurements {
	animationId: number;
	measuredBox: Box;
	layoutBox: Box;
	latestValues: ResolvedValues;
	source: number;
}

export type Phase = 'snapshot' | 'measure';

export interface ScrollMeasurements {
	animationId: number;
	phase: Phase;
	offset: Point;
	isRoot: boolean;
	wasRoot: boolean;
}

export type LayoutEvents =
	| 'willUpdate'
	| 'didUpdate'
	| 'beforeMeasure'
	| 'measure'
	| 'projectionUpdate'
	| 'animationStart'
	| 'animationComplete';

export interface IProjectionNode<I> {
	id: number;
	animationId: number;
	parent?: IProjectionNode<I>;
	relativeParent?: IProjectionNode<I>;
	root?: IProjectionNode<I>;
	children: Set<IProjectionNode<I>>;
	path: IProjectionNode<I>[];
	nodes?: FlatTree<IProjectionNode<I>>;
	depth: number;
	instance: I;
	mount: (node: I, isLayoutDirty?: boolean) => void;
	unmount: () => void;
	options: ProjectionNodeOptions;
	setOptions(options: ProjectionNodeOptions): void;
	layout?: Measurements;
	snapshot?: Measurements;
	target?: Box;
	relativeTarget?: Box;
	relativeTargetOrigin?: Box;
	targetDelta?: Delta;
	targetWithTransforms?: Box;
	scroll?: ScrollMeasurements;
	treeScale?: Point;
	projectionDelta?: Delta;
	projectionDeltaWithTransform?: Delta;
	latestValues: ResolvedValues;
	isLayoutDirty: boolean;
	isProjectionDirty: boolean;
	isSharedProjectionDirty: boolean;
	isTransformDirty: boolean;
	resolvedRelativeTargetAt?: number;
	shouldResetTransform: boolean;
	prevTransformTemplateValue: string | undefined;
	isUpdateBlocked(): boolean;
	updateManuallyBlocked: boolean;
	updateBlockedByResize: boolean;
	blockUpdate(): void;
	unblockUpdate(): void;
	isUpdating: boolean;
	needsReset: boolean;
	startUpdate(): void;
	willUpdate(notifyListeners?: boolean): void;
	didUpdate(): void;
	measure(removeTransform?: boolean): Measurements;
	measurePageBox(): Box;
	updateLayout(): void;
	updateSnapshot(): void;
	clearSnapshot(): void;
	updateScroll(phase?: Phase): void;
	scheduleUpdateProjection(): void;
	scheduleCheckAfterUnmount(): void;
	checkUpdateFailed(): void;
	sharedNodes: Map<string, NodeStack<I>>;
	registerSharedNode(id: string, node: IProjectionNode<I>): void;
	getStack(): NodeStack<I> | undefined;
	isVisible: boolean;
	hide(): void;
	show(): void;
	scheduleRender(notifyAll?: boolean): void;
	getClosestProjectingParent(): IProjectionNode<I> | undefined;

	setTargetDelta(delta: Delta): void;
	resetTransform(): void;
	resetSkewAndRotation(): void;
	applyTransform(box: Box, transformOnly?: boolean): Box;
	resolveTargetDelta(force?: boolean): void;
	calcProjection(): void;
	getProjectionStyles(styleProp?: MotionStyle): MotionStyle | undefined;
	clearMeasurements(): void;
	resetTree(): void;

	isProjecting(): boolean;
	animationValues?: ResolvedValues;
	currentAnimation?: AnimationPlaybackControls;
	isTreeAnimating?: boolean;
	isAnimationBlocked?: boolean;
	isTreeAnimationBlocked: () => boolean;
	setAnimationOrigin(delta: Delta): void;
	startAnimation(transition: Transition): void;
	finishAnimation(): void;
	hasCheckedOptimisedAppear: boolean;

	// Shared element
	isLead(): boolean;
	promote(options?: {
		needsReset?: boolean;
		transition?: Transition;
		preserveFollowOpacity?: boolean;
	}): void;
	relegate(): boolean;
	resumeFrom?: IProjectionNode<I>;
	resumingFrom?: IProjectionNode<I>;
	isPresent?: boolean;

	addEventListener(name: LayoutEvents, handler: any): VoidFunction;
	notifyListeners(name: LayoutEvents, ...args: any): void;
	hasListeners(name: LayoutEvents): boolean;
	hasTreeAnimated: boolean;
	preserveOpacity?: boolean;
}

export interface LayoutUpdateData {
	layout: Box;
	snapshot: Measurements;
	delta: Delta;
	layoutDelta: Delta;
	hasLayoutChanged: boolean;
	hasRelativeTargetChanged: boolean;
}

export type LayoutUpdateHandler = (data: LayoutUpdateData) => void;

export interface ProjectionNodeConfig<I> {
	defaultParent?: () => IProjectionNode<Window>;
	attachResizeListener?: (instance: I, notifyResize: VoidFunction) => VoidFunction;
	measureScroll: (instance: I) => Point;
	checkIsScrollRoot: (instance: I) => boolean;
	resetTransform?: (instance: I, value?: string) => void;
}

export interface ProjectionNodeOptions {
	animate?: boolean;
	layoutScroll?: boolean;
	layoutRoot?: boolean;
	alwaysMeasureLayout?: boolean;
	onExitComplete?: VoidFunction;
	animationType?: 'size' | 'position' | 'both' | 'preserve-aspect';
	layoutId?: string;
	layout?: boolean | string;
	visualElement?: VisualElement<unknown>;
	crossfade?: boolean;
	transition?: Transition;
	initialPromotionConfig?: InitialPromotionConfig;
}

export type ProjectionEventName = 'layoutUpdate' | 'projectionUpdate';
