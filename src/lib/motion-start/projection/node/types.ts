/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Box, Delta, Point, TransformPoint } from '../geometry/types.js';
import type { ResolvedValues } from '../../render/types.js';

export interface Measurements {
	animationId: number;
	measuredBox: Box;
	layoutBox: Box;
	latestValues: ResolvedValues;
	source: number;
}

export interface ScrollMeasurements {
	animationId: number;
	phase: ScrollPhase;
	offset: Point;
	isRoot: boolean;
}

export enum ScrollPhase {
	Idle,
	Read,
	Write,
}

export type LayoutEvents =
	| 'willUpdate'
	| 'measure'
	| 'didUpdate'
	| 'beforeMeasure'
	| 'read'
	| 'update'
	| 'render'
	| 'animationStart'
	| 'animationComplete'
	| 'layoutAnimationStart'
	| 'layoutAnimationComplete'
	| 'projectionUpdate'
	| 'animationCancel'
	| 'layoutAnimationCancel';

export interface IProjectionNode<I = unknown> {
	id: number | undefined;
	animationId: number | undefined;
	parent: IProjectionNode | undefined;
	relativeParent: IProjectionNode | undefined;
	root: IProjectionNode;
	children: Set<IProjectionNode>;
	path: IProjectionNode[];
	depth: number;

	isDirty: boolean;
	isLayoutDirty: boolean;
	isProjectionDirty: boolean;
	isSharedProjectionDirty: boolean;
	isTransformDirty: boolean;

	updateManuallyBlocked: boolean;
	updateBlockedByResize: boolean;

	options: ProjectionNodeConfig<I>;

	prevTransformTemplateValue: string | undefined;
	targetDelta: Delta | undefined;
	target: Box | undefined;
	targetWithTransforms: Box | undefined;
	scroll: Point | undefined;
	scrollTreeScale: Point | undefined;
	treeScale: Point | undefined;

	relativeTarget: Box | undefined;
	relativeTargetOrigin: Box | undefined;

	layout: Box | undefined;
	layoutCorrected: Box | undefined;
	layoutTree: Box | undefined;

	projectionDelta: Delta | undefined;
	projectionDeltaWithTransform: Delta | undefined;

	instance: I;

	addEventListener(name: LayoutEvents, handler: VoidFunction): VoidFunction;
	notifyListeners(name: LayoutEvents, ...args: any[]): void;
	hasListeners(name: LayoutEvents): boolean;
	notify(name: LayoutEvents, ...args: any[]): void;

	mount(instance: I, isLayoutDirty?: boolean): void;
	unmount(): void;

	blockUpdate(): void;
	unblockUpdate(): void;
	isUpdateBlocked(): boolean;

	update(): void;
	updateLayout(): void;
	updateSnapshot(): void;
	clearSnapshot(): void;
	updateScroll(phase?: ScrollPhase): void;

	measure(removeTransform?: boolean): Box;
	measurePageBox(): Box;

	scheduleUpdateProjection(): void;
	scheduleCheckAfterUnmount(): void;

	setAnimationOrigin(delta: Delta, hasOnlyRelativeTargetChanged?: boolean): void;
	startAnimation(options: any): Promise<void>;
	finishAnimation(): void;
	isAnimating(): boolean;

	getStack(): Set<IProjectionNode> | undefined;
	getClosestProjectingParent(): IProjectionNode | undefined;

	resolveTargetDelta(forceRecalculation?: boolean): void;
	calcProjection(): void;

	getProjectionStyles(styleProp?: any): any;

	clearMeasurements(): void;

	resetTransform(): void;
	restoreTransform(): void;
	resetSkewAndRotation(): void;

	isLead(): boolean;
	getLead(): IProjectionNode | undefined;
	getPrevLead(): IProjectionNode | undefined;

	promote(options?: { needsReset?: boolean; transition?: any; preserveFollowOpacity?: boolean }): void;
	relegate(): boolean;

	resumeFrom?: IProjectionNode;
	isPresent?: boolean;
	isPresenceRoot?: boolean;

	presenceId?: number | string | undefined;
}

export interface ProjectionNodeConfig<I = unknown> {
	attachResizeListener?: (ref: I, notify: VoidFunction) => VoidFunction;
	measureScroll?: (instance: I) => Point;
	resetTransform?: (instance: I, value?: ResolvedValues | undefined) => void;
}
