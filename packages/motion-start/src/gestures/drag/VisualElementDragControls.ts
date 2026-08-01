/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { invariant } from '../../utils/errors.js';
import { PanSession, type PanInfo, type PanSessionHandlers } from '../pan/PanSession.js';
import type { ResolvedConstraints } from './types.js';
import { type Lock, getGlobalLock } from './utils/lock.js';
import { isRefObject } from '../../utils/is-ref-object.js';
import {
	calcRelativeConstraints,
	calcViewportConstraints,
	applyConstraints,
	rebaseAxisConstraints,
	resolveDragElastic,
	defaultElastic,
	calcOrigin,
} from './utils/constraints.js';
import type { VisualElement } from '../../render/VisualElement.svelte.js';
import type { MotionProps } from '../../motion/types.js';
import type { Axis, Point } from '../../projection/geometry/types.js';
import { createBox } from '../../projection/geometry/models.js';
import { eachAxis } from '../../projection/utils/each-axis.js';
import { measurePageBox } from '../../projection/utils/measure.js';
import { extractEventInfo } from '../../events/event-info.js';
import type { Transition } from '../../types.js';
import { convertBoundingBoxToBox, convertBoxToBoundingBox } from '../../projection/geometry/conversion.js';
import type { LayoutUpdateData } from '../../projection/node/types.js';
import { addDomEvent } from '../../events/add-dom-event.js';
import { calcLength } from '../../projection/geometry/delta-calc.js';
import { mixNumber } from '../../utils/mix/number.js';
import { percent } from '../../value/types/numbers/units.js';
import { animateMotionValue } from '../../animation/interfaces/motion-value.js';
import { getContextWindow } from '../../utils/get-context-window.js';
import { frame } from '../../frameloop/index.js';
import { addValueToWillChange } from '../../value/use-will-change/add-will-change.js';

export const elementDragControls = new WeakMap<VisualElement<unknown>, VisualElementDragControls>();

/**
 * Tracks the controls instance currently owning an in-progress drag gesture,
 * keyed by the dragged element's resolved `layoutId`. When a dragged
 * `Reorder.Item`/motion element is conditionally reparented into a different
 * DOM subtree mid-gesture (e.g. a kanban card crossing into another
 * `Reorder.Group` while the pointer is still down), the freshly-mounted
 * same-`layoutId` copy looks itself up here and adopts the still-running
 * pointer gesture via `VisualElementDragControls.adopt`, rather than the
 * unmounted element's stale closures silently keeping (or losing) it.
 *
 * Framer Motion v2 had an equivalent mechanism - resuming drag controls from
 * `visualElement.prevSnapshot` in `VisualElementDragControls.mount` - this is
 * this v11-derived architecture's analogue, scoped to gesture ownership
 * rather than layout snapshots.
 */
export const activeLayoutIdDrags = new Map<string, VisualElementDragControls>();

export interface DragControlOptions {
	snapToCursor?: boolean;
	cursorProgress?: Point;
}

type DragDirection = 'x' | 'y';

/**
 *
 */
// let latestPointerEvent: PointerEvent

export class VisualElementDragControls {
	private visualElement: VisualElement<HTMLElement>;

	private panSession?: PanSession;

	// This is a reference to the global drag gesture lock, ensuring only one component
	// can "capture" the drag of one or both axes.
	// TODO: Look into moving this into pansession?
	private openGlobalLock: Lock | null = null;

	isDragging = false;
	private currentDirection: DragDirection | null = null;

	private originPoint: Point = { x: 0, y: 0 };
	private cursorOffset: Point = { x: 0, y: 0 };
	private latestPointerPoint?: Point;
	private latestPointerOffset?: Point;
	private renderedCenterBeforeOnDrag?: Point;
	private activeLayoutId?: string;

	/**
	 * The permitted boundaries of travel, in pixels.
	 */
	private constraints: ResolvedConstraints | false = false;

	private hasMutatedConstraints = false;
	private skipNextLayoutRebase = false;

	/**
	 * The per-axis resolved elastic values.
	 */
	private elastic = createBox();

	constructor(visualElement: VisualElement<HTMLElement>) {
		this.visualElement = visualElement;
	}

	private getLayoutId(): string | undefined {
		return (this.getProps() as MotionProps).layoutId;
	}

	private syncActiveLayoutId() {
		const layoutId = this.getLayoutId();
		if (layoutId === this.activeLayoutId) return;

		if (this.activeLayoutId !== undefined && activeLayoutIdDrags.get(this.activeLayoutId) === this) {
			activeLayoutIdDrags.delete(this.activeLayoutId);
		}

		this.activeLayoutId = layoutId;
		if (layoutId !== undefined) {
			activeLayoutIdDrags.set(layoutId, this);
		}
	}

	/**
	 * Build the set of `PanSession` handlers bound to this controls instance.
	 * Used both to start a brand new session and, via `updateHandlers`, to
	 * retarget an existing (already-running) session onto this instance when
	 * adopting a handed-off gesture.
	 */
	private buildSessionHandlers(snapToCursor = false): Partial<PanSessionHandlers> {
		const onSessionStart = (event: PointerEvent) => {
			const { dragSnapToOrigin } = this.getProps();

			// Stop or pause any animations on both axis values immediately. This allows the user to throw and catch
			// the component.
			dragSnapToOrigin ? this.pauseAnimation() : this.stopAnimation();

			if (snapToCursor) {
				this.snapToCursor(extractEventInfo(event, 'page').point);
			}
		};

		const onStart = (event: PointerEvent, info: PanInfo) => {
			// Attempt to grab the global drag gesture lock - maybe make this part of PanSession
			const { drag, dragPropagation, onDragStart } = this.getProps();

			if (drag && !dragPropagation) {
				if (this.openGlobalLock) this.openGlobalLock();
				this.openGlobalLock = getGlobalLock(drag);

				// If we don 't have the lock, don't start dragging
				if (!this.openGlobalLock) return;
			}

			this.isDragging = true;

			this.currentDirection = null;
			const center = this.measureRenderedCenter();
			if (center) {
				this.cursorOffset = {
					x: center.x + window.scrollX - (info.point.x - info.offset.x),
					y: center.y + window.scrollY - (info.point.y - info.offset.y),
				};
			}
			this.latestPointerPoint = info.point;
			this.latestPointerOffset = info.offset;

			this.resolveConstraints();

			if (this.visualElement.projection) {
				this.visualElement.projection.isAnimationBlocked = true;
				this.visualElement.projection.target = undefined;
			}

			/**
			 * Record gesture origin
			 */
			eachAxis((axis) => {
				let current = this.getAxisMotionValue(axis).get() || 0;

				/**
				 * If the MotionValue is a percentage value convert to px
				 */
				if (percent.test(current)) {
					const { projection } = this.visualElement;

					if (projection && projection.layout) {
						const measuredAxis = projection.layout.layoutBox[axis];

						if (measuredAxis) {
							const length = calcLength(measuredAxis);
							current = length * (Number.parseFloat(current) / 100);
						}
					}
				}

				this.originPoint[axis] = current;
			});

			this.syncActiveLayoutId();

			// Fire onDragStart event
			if (onDragStart) {
				frame.postRender(() => onDragStart(event, info));
			}

			addValueToWillChange(this.visualElement, 'transform');

			const { animationState } = this.visualElement;
			animationState && animationState.setActive('whileDrag', true);
		};

		const onMove = (event: PointerEvent, info: PanInfo) => {
			// latestPointerEvent = event

			const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();

			// If we didn't successfully receive the gesture lock, early return.
			if (!dragPropagation && !this.openGlobalLock) return;

			const { offset } = info;
			this.syncActiveLayoutId();
			this.latestPointerPoint = info.point;
			this.latestPointerOffset = offset;
			// Attempt to detect drag direction if directionLock is true
			if (dragDirectionLock && this.currentDirection === null) {
				this.currentDirection = getCurrentDirection(offset);

				// If we've successfully set a direction, notify listener
				if (this.currentDirection !== null) {
					onDirectionLock && onDirectionLock(this.currentDirection);
				}

				return;
			}

			// Update each point with the latest position
			this.updateAxis('x', info.point, offset);
			this.updateAxis('y', info.point, offset);

			/**
			 * Ideally we would leave the renderer to fire naturally at the end of
			 * this frame but if the element is about to change layout as the result
			 * of a re-render we want to ensure the browser can read the latest
			 * bounding box to ensure the pointer and element don't fall out of sync.
			 */
			this.visualElement.render();

			/**
			 * This must fire after the render call as it might trigger a state
			 * change which itself might trigger a layout update.
			 */
			if (onDrag) {
				this.renderedCenterBeforeOnDrag = this.measureRenderedCenter();
				onDrag(event, info);
				frame.read(this.compensateForOnDragLayoutShift);
			}
		};

		const onSessionEnd = (event: PointerEvent, info: PanInfo) => this.stop(event, info);

		const resumeAnimation = () =>
			eachAxis((axis) => this.getAnimationState(axis) === 'paused' && this.getAxisMotionValue(axis).animation?.play());

		return { onSessionStart, onStart, onMove, onSessionEnd, resumeAnimation };
	}

	start(originEvent: PointerEvent, { snapToCursor = false }: DragControlOptions = {}) {
		/**
		 * Don't start dragging if this component is exiting
		 */
		const { presenceContext } = this.visualElement;
		if (presenceContext && presenceContext.isPresent === false) return;

		const { dragSnapToOrigin } = this.getProps();
		this.panSession = new PanSession(originEvent, this.buildSessionHandlers(snapToCursor), {
			transformPagePoint: this.visualElement.getTransformPagePoint(),
			dragSnapToOrigin,
			contextWindow: getContextWindow(this.visualElement),
		});
	}

	/**
	 * Take over an in-progress drag gesture from `previous`: the same live
	 * `PanSession` (and therefore the same window-level pointermove/pointerup
	 * listeners already tracking this gesture) is retargeted to call back into
	 * *this* controls instance instead, so the freshly-mounted element's props
	 * (`onDrag`, `onDragEnd`, etc.) drive the rest of the gesture rather than
	 * the unmounted element's stale closures. Returns `false` if `previous`
	 * isn't actually mid-gesture.
	 */
	adopt(previous: VisualElementDragControls): boolean {
		const { panSession } = previous;
		if (!panSession || !previous.isDragging) return false;

		this.panSession = panSession;
		this.isDragging = true;
		this.currentDirection = previous.currentDirection;
		this.openGlobalLock = previous.openGlobalLock;
		this.skipNextLayoutRebase = true;
		frame.postRender(() => {
			this.skipNextLayoutRebase = false;
		});
		this.cursorOffset = previous.cursorOffset;
		this.latestPointerPoint = previous.latestPointerPoint;
		this.latestPointerOffset = previous.latestPointerOffset;

		const nextCenter = this.measureDragCenter();

		eachAxis((axis) => {
			if (this.latestPointerPoint && this.latestPointerOffset && nextCenter) {
				const scroll = axis === 'x' ? window.scrollX : window.scrollY;
				const next = this.latestPointerPoint[axis] + this.cursorOffset[axis] - (nextCenter[axis] + scroll);
				this.originPoint[axis] = next - this.latestPointerOffset[axis];
				this.getAxisMotionValue(axis).set(next);
			} else {
				this.originPoint[axis] = previous.originPoint[axis];

				const previousValue = previous.getAxisMotionValue(axis).get();
				if (typeof previousValue === 'number') {
					this.getAxisMotionValue(axis).set(previousValue);
				}
			}
		});

		this.resolveConstraints();

		if (this.visualElement.projection) {
			const { projection } = this.visualElement;
			projection.isAnimationBlocked = true;
			projection.finishAnimation();
			projection.target = undefined;
			projection.relativeTarget = undefined;
			projection.targetDelta = undefined;
			projection.projectionDelta = undefined;
			projection.projectionDeltaWithTransform = undefined;
			projection.resumeFrom = undefined;
			projection.resumingFrom = undefined;
			projection.isProjectionDirty = true;
		}

		panSession.updateHandlers(this.buildSessionHandlers());

		// Detach the predecessor from the gesture it no longer owns so its own
		// unmount cleanup can't cancel the session or release a lock this
		// controls instance is now relying on.
		previous.panSession = undefined;
		previous.isDragging = false;
		previous.openGlobalLock = null;

		addValueToWillChange(this.visualElement, 'transform');

		const { animationState } = this.visualElement;
		animationState && animationState.setActive('whileDrag', true);

		this.syncActiveLayoutId();

		return true;
	}

	cancelIfHandoffMissed() {
		if (!this.isDragging) return;

		const layoutId = this.activeLayoutId;
		if (layoutId === undefined) {
			this.cancel();
			return;
		}

		frame.postRender(() => {
			if (this.isDragging && activeLayoutIdDrags.get(layoutId) === this) {
				this.cancel();
			}
		});
	}

	private stop(event: PointerEvent, info: PanInfo) {
		const isDragging = this.isDragging;
		this.cancel();
		if (!isDragging) return;

		const { velocity } = info;
		this.startAnimation(velocity);

		const { onDragEnd } = this.getProps();
		if (onDragEnd) {
			frame.postRender(() => onDragEnd(event, info));
		}
	}

	private cancel() {
		this.isDragging = false;
		const { projection, animationState } = this.visualElement;
		if (projection) {
			projection.isAnimationBlocked = false;
		}
		this.panSession && this.panSession.end();
		this.panSession = undefined;

		if (this.openGlobalLock) {
			this.openGlobalLock();
			this.openGlobalLock = null;
		}

		if (this.activeLayoutId !== undefined && activeLayoutIdDrags.get(this.activeLayoutId) === this) {
			activeLayoutIdDrags.delete(this.activeLayoutId);
		}
		this.activeLayoutId = undefined;

		animationState && animationState.setActive('whileDrag', false);
	}

	private measureDragCenter(): Point | undefined {
		const renderedCenter = this.measureRenderedCenter();
		if (!renderedCenter) return undefined;

		const x = this.getAxisMotionValue('x').get();
		const y = this.getAxisMotionValue('y').get();
		// Centers remain stable under whileDrag scale/rotation. Removing only
		// the drag translation keeps both layouts in the same DOM coordinate space.
		return {
			x: renderedCenter.x - (typeof x === 'number' ? x : 0),
			y: renderedCenter.y - (typeof y === 'number' ? y : 0),
		};
	}

	private compensateForOnDragLayoutShift = () => {
		const centerBefore = this.renderedCenterBeforeOnDrag;
		this.renderedCenterBeforeOnDrag = undefined;
		if (!this.isDragging || !centerBefore) return;

		const centerAfter = this.measureRenderedCenter();
		if (!centerAfter) return;

		// Compensate only for the rendered shift caused after `onDrag`.
		// Pointer-driven movement stays in updateAxis, where constraints apply.
		let hasRebased = false;
		eachAxis((axis) => {
			const delta = centerBefore[axis] - centerAfter[axis];
			if (Math.abs(delta) < 0.5) return;

			const motionValue = this.getAxisMotionValue(axis);
			const current = motionValue.get();
			if (typeof current !== 'number') return;

			this.originPoint[axis] += delta;
			motionValue.set(current + delta);
			hasRebased = true;
		});
		if (hasRebased) this.visualElement.render();
	};

	private measureRenderedCenter(): Point | undefined {
		if (!this.visualElement.current) return undefined;

		const box = this.visualElement.measureViewportBox();
		return {
			x: (box.x.min + box.x.max) / 2,
			y: (box.y.min + box.y.max) / 2,
		};
	}

	private updateAxis(axis: DragDirection, _point: Point, offset?: Point) {
		const { drag } = this.getProps();

		// If we're not dragging this axis, do an early return.
		if (!offset || !shouldDrag(axis, drag, this.currentDirection)) return;

		const axisValue = this.getAxisMotionValue(axis);
		let next = this.originPoint[axis] + offset[axis];

		// Apply constraints
		if (this.constraints && this.constraints[axis]) {
			next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
		}

		axisValue.set(next);
	}

	private resolveConstraints() {
		const { dragConstraints, dragElastic } = this.getProps();

		const layout =
			this.visualElement.projection && !this.visualElement.projection.layout
				? this.visualElement.projection.measure(false)
				: this.visualElement.projection?.layout;

		const prevConstraints = this.constraints;

		if (dragConstraints && isRefObject(dragConstraints)) {
			if (!this.constraints) {
				this.constraints = this.resolveRefConstraints();
			}
		} else {
			if (dragConstraints && layout) {
				this.constraints = calcRelativeConstraints(layout.layoutBox, dragConstraints);
			} else {
				this.constraints = false;
			}
		}

		this.elastic = resolveDragElastic(dragElastic);

		/**
		 * If we're outputting to external MotionValues, we want to rebase the measured constraints
		 * from viewport-relative to component-relative.
		 */
		if (prevConstraints !== this.constraints && layout && this.constraints && !this.hasMutatedConstraints) {
			eachAxis((axis) => {
				if (this.constraints !== false && this.getAxisMotionValue(axis)) {
					this.constraints[axis] = rebaseAxisConstraints(layout.layoutBox[axis], this.constraints[axis]);
				}
			});
		}
	}

	private resolveRefConstraints() {
		const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
		if (!constraints || !isRefObject(constraints)) return false;

		const constraintsElement = constraints.current as HTMLElement;

		invariant(
			constraintsElement !== null,
			"If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop."
		);

		const { projection } = this.visualElement;

		// TODO
		if (!projection || !projection.layout) return false;

		const constraintsBox = measurePageBox(
			constraintsElement,
			projection.root!,
			this.visualElement.getTransformPagePoint()
		);

		let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);

		/**
		 * If there's an onMeasureDragConstraints listener we call it and
		 * if different constraints are returned, set constraints to that
		 */
		if (onMeasureDragConstraints) {
			const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));

			this.hasMutatedConstraints = !!userConstraints;

			if (userConstraints) {
				measuredConstraints = convertBoundingBoxToBox(userConstraints);
			}
		}

		return measuredConstraints;
	}

	private startAnimation(velocity: Point) {
		const { drag, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();

		const constraints: Partial<ResolvedConstraints> = this.constraints || {};

		const momentumAnimations = eachAxis((axis) => {
			if (!shouldDrag(axis, drag, this.currentDirection)) {
				return;
			}

			let transition = (constraints && constraints[axis]) || {};

			if (dragSnapToOrigin) transition = { min: 0, max: 0 };

			/**
			 * Overdamp the boundary spring if `dragElastic` is disabled. There's still a frame
			 * of spring animations so we should look into adding a disable spring option to `inertia`.
			 * We could do something here where we affect the `bounceStiffness` and `bounceDamping`
			 * using the value of `dragElastic`.
			 */
			const bounceStiffness = dragElastic ? 200 : 1000000;
			const bounceDamping = dragElastic ? 40 : 10000000;

			const inertia = {
				type: 'inertia',
				velocity: dragMomentum ? velocity[axis] : 0,
				bounceStiffness,
				bounceDamping,
				timeConstant: 750,
				restDelta: 1,
				restSpeed: 10,
				...dragTransition,
				...transition,
			};

			// If we're not animating on an externally-provided `MotionValue` we can use the
			// component's animation controls which will handle interactions with whileHover (etc),
			// otherwise we just have to animate the `MotionValue` itself.
			return this.startAxisValueAnimation(axis, inertia);
		});

		// Run all animations and then resolve the new drag constraints.
		return Promise.all(momentumAnimations).then(onDragTransitionEnd);
	}

	private startAxisValueAnimation(axis: DragDirection, transition: Transition) {
		const axisValue = this.getAxisMotionValue(axis);

		addValueToWillChange(this.visualElement, axis);

		return axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
	}

	private stopAnimation() {
		eachAxis((axis) => this.getAxisMotionValue(axis).stop());
	}

	private pauseAnimation() {
		eachAxis((axis) => this.getAxisMotionValue(axis).animation?.pause());
	}

	private getAnimationState(axis: DragDirection) {
		return this.getAxisMotionValue(axis).animation?.state;
	}

	/**
	 * Drag works differently depending on which props are provided.
	 *
	 * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
	 * - Otherwise, we apply the delta to the x/y motion values.
	 */
	private getAxisMotionValue(axis: DragDirection) {
		const dragKey = `_drag${axis.toUpperCase()}` as `_drag${Uppercase<DragDirection>}`;
		const props = this.visualElement.getProps();
		const externalMotionValue = props[dragKey];

		return externalMotionValue
			? externalMotionValue
			: this.visualElement.getValue(
					axis,
					(props.initial ? props.initial[axis as keyof typeof props.initial] : undefined) || 0
				);
	}

	private snapToCursor(point: Point) {
		eachAxis((axis) => {
			const { drag } = this.getProps();

			// If we're not dragging this axis, do an early return.
			if (!shouldDrag(axis, drag, this.currentDirection)) return;

			const { projection } = this.visualElement;
			const axisValue = this.getAxisMotionValue(axis);

			if (projection && projection.layout) {
				const { min, max } = projection.layout.layoutBox[axis];

				axisValue.set(point[axis] - mixNumber(min, max, 0.5));
			}
		});
	}

	/**
	 * When the viewport resizes we want to check if the measured constraints
	 * have changed and, if so, reposition the element within those new constraints
	 * relative to where it was before the resize.
	 */
	scalePositionWithinConstraints() {
		if (!this.visualElement.current) return;

		const { drag, dragConstraints } = this.getProps();
		const { projection } = this.visualElement;
		if (!isRefObject(dragConstraints) || !projection || !this.constraints) return;

		/**
		 * Stop current animations as there can be visual glitching if we try to do
		 * this mid-animation
		 */
		this.stopAnimation();

		/**
		 * Record the relative position of the dragged element relative to the
		 * constraints box and save as a progress value.
		 */
		const boxProgress = { x: 0, y: 0 };
		eachAxis((axis) => {
			const axisValue = this.getAxisMotionValue(axis);
			if (axisValue && this.constraints !== false) {
				const latest = axisValue.get();
				boxProgress[axis] = calcOrigin({ min: latest, max: latest }, this.constraints[axis] as Axis);
			}
		});

		/**
		 * Update the layout of this element and resolve the latest drag constraints
		 */
		const { transformTemplate } = this.visualElement.getProps();
		this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, '') : 'none';
		projection.root && projection.root.updateScroll();
		projection.updateLayout();
		this.resolveConstraints();

		/**
		 * For each axis, calculate the current progress of the layout axis
		 * within the new constraints.
		 */
		eachAxis((axis) => {
			if (!shouldDrag(axis, drag, null)) return;

			/**
			 * Calculate a new transform based on the previous box progress
			 */
			const axisValue = this.getAxisMotionValue(axis);
			const { min, max } = (this.constraints as ResolvedConstraints)[axis] as Axis;
			axisValue.set(mixNumber(min, max, boxProgress[axis]));
		});
	}

	addListeners() {
		if (!this.visualElement.current) return;
		elementDragControls.set(this.visualElement, this);

		const measureDragConstraints = () => {
			const { dragConstraints } = this.getProps();
			if (isRefObject(dragConstraints) && dragConstraints.current) {
				this.constraints = this.resolveRefConstraints();
			}
		};

		const { projection } = this.visualElement;

		const stopMeasureLayoutListener = projection!.addEventListener('measure', measureDragConstraints);

		if (projection && !projection!.layout) {
			projection.root && projection.root.updateScroll();
			projection.updateLayout();
		}

		frame.read(measureDragConstraints);

		/**
		 * Attach a window resize listener to scale the draggable target within its defined
		 * constraints as the window resizes.
		 */
		const stopResizeListener = addDomEvent(window, 'resize', () => this.scalePositionWithinConstraints());

		/**
		 * If the element's layout changes, calculate the delta and apply that to
		 * the drag gesture's origin point.
		 */
		const stopLayoutUpdateListener = projection!.addEventListener('didUpdate', (({
			delta,
			hasLayoutChanged,
		}: LayoutUpdateData) => {
			if (this.isDragging && hasLayoutChanged) {
				if (this.skipNextLayoutRebase) {
					this.skipNextLayoutRebase = false;
					return;
				}

				eachAxis((axis) => {
					const motionValue = this.getAxisMotionValue(axis);
					if (!motionValue) return;

					this.originPoint[axis] += delta[axis].translate;
					motionValue.set(motionValue.get() + delta[axis].translate);
				});
				this.visualElement.render();
			}
		}) as any);

		return () => {
			stopResizeListener();
			stopMeasureLayoutListener();
			stopLayoutUpdateListener && stopLayoutUpdateListener();
		};
	}

	getProps(): MotionProps {
		const props = this.visualElement.getProps();
		const {
			drag = false,
			dragDirectionLock = false,
			dragPropagation = false,
			dragConstraints = false,
			dragElastic = defaultElastic,
			dragMomentum = true,
		} = props;
		return {
			...props,
			drag,
			dragDirectionLock,
			dragPropagation,
			dragConstraints,
			dragElastic,
			dragMomentum,
		};
	}
}

function shouldDrag(
	direction: DragDirection,
	drag: boolean | DragDirection | undefined,
	currentDirection: null | DragDirection
) {
	return (drag === true || drag === direction) && (currentDirection === null || currentDirection === direction);
}

/**
 * Based on an x/y offset determine the current drag direction. If both axis' offsets are lower
 * than the provided threshold, return `null`.
 *
 * @param offset - The x/y offset from origin.
 * @param lockThreshold - (Optional) - the minimum absolute offset before we can determine a drag direction.
 */
function getCurrentDirection(offset: Point, lockThreshold = 10): DragDirection | null {
	let direction: DragDirection | null = null;

	if (Math.abs(offset.y) > lockThreshold) {
		direction = 'y';
	} else if (Math.abs(offset.x) > lockThreshold) {
		direction = 'x';
	}

	return direction;
}

export function expectsResolvedDragConstraints({ dragConstraints, onMeasureDragConstraints }: MotionProps) {
	return isRefObject(dragConstraints) && !!onMeasureDragConstraints;
}
