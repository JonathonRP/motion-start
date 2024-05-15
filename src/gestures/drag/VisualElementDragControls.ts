/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { RefObject } from "react";
import type { PanInfo } from "../../gestures/PanSession";
import type { MotionProps } from "../../motion/types";
import type { VisualElement } from "../../render/types";
import type { AxisBox2D, Point2D, TransformPoint2D } from "../../types/geometry";
import type { DraggableProps, ResolvedConstraints } from "./types";
import type { Lock } from "./utils/lock.js";


interface DragControlConfig {
    visualElement: VisualElement;
}
export interface DragControlOptions {
    snapToCursor?: boolean;
    cursorProgress?: Point2D;
}
interface DragControlsProps extends DraggableProps {
    transformPagePoint?: TransformPoint2D;
}
declare type DragDirection = "x" | "y";
export declare function expectsResolvedDragConstraints({ dragConstraints, onMeasureDragConstraints, }: MotionProps): boolean;

/** 
based on framer-motion@4.1.15,
Copyright (c) 2018 Framer B.V.
*/
import { flushSync } from 'framesync';
import { progress } from 'popmotion';
import { __assign, __read, __spreadArray } from 'tslib';
import { startAnimation } from '../../animation/utils/transitions.js';
import { getViewportPointFromEvent } from '../../events/event-info.js';
import { addDomEvent } from '../../events/use-dom-event.js';
import { addPointerEvent } from '../../events/use-pointer-event.js';
import { calcRelativeOffset } from '../../motion/features/layout/utils.js';
import { convertToRelativeProjection } from '../../render/dom/projection/convert-to-relative.js';
import { getBoundingBox } from '../../render/dom/projection/measure.js';
import { collectProjectingAncestors, collectProjectingChildren, updateLayoutMeasurement } from '../../render/dom/projection/utils.js';
import { batchLayout, flushLayout } from '../../render/dom/utils/batch-layout.js';
import { AnimationType } from '../../render/utils/types.js';
import { eachAxis } from '../../utils/each-axis.js';
import { invariant } from '../../utils/errors.js';
import { calcOrigin } from '../../utils/geometry/delta-calc.js';
import { axisBox, convertAxisBoxToBoundingBox, convertBoundingBoxToAxisBox } from '../../utils/geometry/index.js';
import { isRefObject } from '../../utils/is-ref-object.js';
import { PanSession } from '../PanSession.js';
import { applyConstraints, calcConstrainedMinPoint, calcPositionFromProgress, calcRelativeConstraints, calcViewportConstraints, defaultElastic, rebaseAxisConstraints, resolveDragElastic } from './utils/constraints.js';
import { getGlobalLock } from './utils/lock.js';

var elementDragControls: WeakMap<VisualElement<any, any>, VisualElementDragControls> = new WeakMap();
/**
 *
 */
var lastPointerEvent;

class VisualElementDragControls {
    /**
     * Track whether we're currently dragging.
     *
     * @internal
     */
    isDragging = false;
    /**
     * The current direction of drag, or `null` if both.
     *
     * @internal
     */
    private currentDirection: DragDirection | null = null;
    /**
     * The permitted boundaries of travel, in pixels.
     *
     * @internal
     */
    private constraints: ResolvedConstraints | false = false;
    /**
     * The per-axis resolved elastic values.
     *
     * @internal
     */
    private elastic = axisBox();
    /**
     * A reference to the host component's latest props.
     *
     * @internal
     */
    private props: MotionProps & DragControlsProps = {};
    /**
     * @internal
     */
    private visualElement: VisualElement<HTMLElement>;
    /**
     * @internal
     */
    private hasMutatedConstraints = false;
    /**
     * @internal
     */
    private cancelLayout?;
    /**
     * Track the initial position of the cursor relative to the dragging element
     * when dragging starts as a value of 0-1 on each axis. We then use this to calculate
     * an ideal bounding box for the VisualElement renderer to project into every frame.
     *
     * @internal
     */
    private cursorProgress: Point2D = {
            x: 0.5,
            y: 0.5,
        };
    private originPoint: Point2D = { x: 0, y: 0 };
    private openGlobalLock: Lock | null = null;
    /**
     * @internal
     */
    private panSession?: PanSession;
    /**
     * A reference to the measured constraints bounding box
     */
    private constraintsBox?;

    constructor({ visualElement }: DragControlConfig) {
        this.visualElement = visualElement;
        this.visualElement.enableLayoutProjection();
        elementDragControls.set(visualElement, this);
    }
    /**
     * Instantiate a PanSession for the drag gesture
     *
     * @public
     */
    start(originEvent: PointerEvent, { snapToCursor = false, cursorProgress = undefined }: DragControlOptions = {}) {
        const onSessionStart = (event: PointerEvent | typeof this.cancelLayout) => {
            // Stop any animations on both axis values immediately. This allows the user to throw and catch
            // the component.
            this.stopMotion();
            /**
             * Save the initial point. We'll use this to calculate the pointer's position rather
             * than the one we receive when the gesture actually starts. By then, the pointer will
             * have already moved, and the perception will be of the pointer "slipping" across the element
             */
            var initialPoint = getViewportPointFromEvent(event).point;
            (event = this.cancelLayout) === null || event === void 0 ? void 0 : event.call(this);
            var _self = this;
            this.cancelLayout = batchLayout(function (read, write) {
                var ancestors = collectProjectingAncestors(_self.visualElement);
                var children = collectProjectingChildren(_self.visualElement);
                var tree = __spreadArray(__spreadArray([], __read(ancestors)), __read(children));
                var hasManuallySetCursorOrigin = false;
                /**
                 * Apply a simple lock to the projection target. This ensures no animations
                 * can run on the projection box while this lock is active.
                 */
                _self.isLayoutDrag() && _self.visualElement.lockProjectionTarget();
                write(function () {
                    tree.forEach(function (element) { return element.resetTransform(); });
                });
                read(function () {
                    updateLayoutMeasurement(_self.visualElement);
                    children.forEach(updateLayoutMeasurement);
                });
                write(function () {
                    tree.forEach(function (element) { return element.restoreTransform(); });
                    if (snapToCursor) {
                        hasManuallySetCursorOrigin = _self.snapToCursor(initialPoint);
                    }
                });
                read(function () {
                    var isRelativeDrag = Boolean(_self.getAxisMotionValue("x") && !_self.isExternalDrag());
                    if (!isRelativeDrag) {
                        _self.visualElement.rebaseProjectionTarget(true, _self.visualElement.measureViewportBox(false));
                    }
                    _self.visualElement.scheduleUpdateLayoutProjection();
                    /**
                     * When dragging starts, we want to find where the cursor is relative to the bounding box
                     * of the element. Every frame, we calculate a new bounding box using this relative position
                     * and let the visualElement renderer figure out how to reproject the element into this bounding
                     * box.
                     *
                     * By doing it this way, rather than applying an x/y transform directly to the element,
                     * we can ensure the component always visually sticks to the cursor as we'd expect, even
                     * if the DOM element itself changes layout as a result of React updates the user might
                     * make based on the drag position.
                     */
                    var projection = _self.visualElement.projection;
                    eachAxis(function (axis) {
                        if (!hasManuallySetCursorOrigin) {
                            var _a = projection.target[axis], min = _a.min, max = _a.max;
                            _self.cursorProgress[axis] = cursorProgress
                                ? cursorProgress[axis]
                                : progress(min, max, initialPoint[axis]);
                        }
                        /**
                         * If we have external drag MotionValues, record their origin point. On pointermove
                         * we'll apply the pan gesture offset directly to this value.
                         */
                        var axisValue = _self.getAxisMotionValue(axis);
                        if (axisValue) {
                            _self.originPoint[axis] = axisValue.get();
                        }
                    });
                });
                write(function () {
                    flushSync.update();
                    flushSync.preRender();
                    flushSync.render();
                    flushSync.postRender();
                });
                read(function () { return _self.resolveDragConstraints(); });
            });
        };
        const onStart = (event: PointerEvent, info: PanInfo) => {
            // Attempt to grab the global drag gesture lock - maybe make this part of PanSession
            const { drag, dragPropagation, onDragStart } = this.props;
            if (drag && !dragPropagation) {
                if (this.openGlobalLock)
                    this.openGlobalLock();
                this.openGlobalLock = getGlobalLock(drag);
                // If we don 't have the lock, don't start dragging
                if (!this.openGlobalLock)
                    return;
            }
            flushLayout();
            // Set current drag status
            this.isDragging = true;
            this.currentDirection = null;
            // Fire onDragStart event
            if(onDragStart) onDragStart(event, info);
            const { animationState } = this.visualElement;
            animationState && animationState.setActive(AnimationType.Drag, true);
        };
        const onMove = (event: PointerEvent, info: PanInfo) => {
            const {
                dragPropagation,
                dragDirectionLock,
                onDirectionLock,
                onDrag,
            } = this.props;
            // If we didn't successfully receive the gesture lock, early return.
            if (!dragPropagation && !this.openGlobalLock)
                return;
            var offset = info.offset;
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
            this.updateAxis("x", info.point, offset);
            this.updateAxis("y", info.point, offset);
            // Fire onDrag event
            onDrag && onDrag(event, info);
            // Update the last pointer event
            lastPointerEvent = event;
        };
        const onSessionEnd = (event: PointerEvent, info: PanInfo) => {
            return this.stop(event, info);
        };
        const transformPagePoint = this.props.transformPagePoint;
        this.panSession = new PanSession(originEvent, {
            onSessionStart,
            onStart,
            onMove,
            onSessionEnd,
        }, { transformPagePoint: transformPagePoint });
    }
    resolveDragConstraints() {
        const { dragConstraints, dragElastic } = this.props;
        var layout = this.visualElement.getLayoutState().layoutCorrected;
        if (dragConstraints) {
            this.constraints = isRefObject(dragConstraints)
                ? this.resolveRefConstraints(layout, dragConstraints)
                : calcRelativeConstraints(layout, dragConstraints);
        }
        else {
            this.constraints = false;
        }
        this.elastic = resolveDragElastic(dragElastic);
        /**
         * If we're outputting to external MotionValues, we want to rebase the measured constraints
         * from viewport-relative to component-relative.
         */
        if (this.constraints && !this.hasMutatedConstraints) {
            eachAxis((axis) => {
                if (this.getAxisMotionValue(axis)) {
                    this.constraints[axis] = rebaseAxisConstraints(layout[axis], this.constraints[axis]);
                }
            });
        }
    }
    private resolveRefConstraints(layoutBox: AxisBox2D, constraints: RefObject<Element>) {
        const { transformPagePoint, onMeasureDragConstraints } = this.props;
        const constraintsElement = constraints.current as HTMLElement;
        invariant(constraintsElement !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.");
        this.constraintsBox = getBoundingBox(constraintsElement, transformPagePoint);
        var measuredConstraints = calcViewportConstraints(layoutBox, this.constraintsBox);
        /**
         * If there's an onMeasureDragConstraints listener we call it and
         * if different constraints are returned, set constraints to that
         */
        if (onMeasureDragConstraints) {
            var userConstraints = onMeasureDragConstraints(convertAxisBoxToBoundingBox(measuredConstraints));
            this.hasMutatedConstraints = !!userConstraints;
            if (userConstraints) {
                measuredConstraints = convertBoundingBoxToAxisBox(userConstraints);
            }
        }
        return measuredConstraints;
    }
    private cancelDrag() {
        var _a, _b;
        this.visualElement.unlockProjectionTarget();
        (_a = this.cancelLayout) === null || _a === void 0 ? void 0 : _a.call(this);
        this.isDragging = false;
        const { projection, animationState } = this.visualElement
        this.panSession && this.panSession.end();
        this.panSession = undefined;
        if (!this.props.dragPropagation && this.openGlobalLock) {
            this.openGlobalLock();
            this.openGlobalLock = null;
        }
        animationState && animationState.setActive(AnimationType.Drag, false)
    }
    private stop(event: PointerEvent, info: PanInfo) {
        var _a, _b, _c;
        (_a = this.panSession) === null || _a === void 0 ? void 0 : _a.end();
        this.panSession = undefined;
        var isDragging = this.isDragging;
        this.cancelDrag();
        if (!isDragging)
            return;
        var velocity = info.velocity;
        this.animateDragEnd(velocity);
        const { onDragEnd } = this.props;
        if (onDragEnd) onDragEnd(event, info)
    }
    snapToCursor(point: Point2D) {
        var _this = this;
        return eachAxis(function (axis) {
            var drag = _this.props.drag;
            // If we're not dragging this axis, do an early return.
            if (!shouldDrag(axis, drag, _this.currentDirection))
                return;
            var axisValue = _this.getAxisMotionValue(axis);
            if (axisValue) {
                var box = _this.visualElement.getLayoutState().layout;
                var length_1 = box[axis].max - box[axis].min;
                var center = box[axis].min + length_1 / 2;
                var offset = point[axis] - center;
                _this.originPoint[axis] = point[axis];
                axisValue.set(offset);
            }
            else {
                _this.cursorProgress[axis] = 0.5;
                return true;
            }
        }).includes(true);
    };
    /**
     * Update the specified axis with the latest pointer information.
     */
    private updateAxis(axis: DragDirection, point: Point2D, offset?: Point2D) {
        var drag = this.props.drag;
        // If we're not dragging this axis, do an early return.
        if (!shouldDrag(axis, drag, this.currentDirection))
            return;
        return this.getAxisMotionValue(axis)
            ? this.updateAxisMotionValue(axis, offset)
            : this.updateVisualElementAxis(axis, point);
    };
    private updateAxisMotionValue(axis: DragDirection, offset?: Point2D) {
        var axisValue = this.getAxisMotionValue(axis);
        if (!offset || !axisValue)
            return;
        var nextValue = this.originPoint[axis] + offset[axis];
        var update = this.constraints
            ? applyConstraints(nextValue, this.constraints[axis], this.elastic[axis])
            : nextValue;
        axisValue.set(update);
    };
    private updateVisualElementAxis(axis: DragDirection, point: Point2D) {
        var _a;
        // Get the actual layout bounding box of the element
        var axisLayout = this.visualElement.getLayoutState().layout[axis];
        // Calculate its current length. In the future we might want to lerp this to animate
        // between lengths if the layout changes as we change the DOM
        var axisLength = axisLayout.max - axisLayout.min;
        // Get the initial progress that the pointer sat on this axis on gesture start.
        var axisProgress = this.cursorProgress[axis];
        // Calculate a new min point based on the latest pointer position, constraints and elastic
        var min = calcConstrainedMinPoint(point[axis], axisLength, axisProgress, (_a = this.constraints) === null || _a === void 0 ? void 0 : _a[axis], this.elastic[axis]);
        // Update the axis viewport target with this new min and the length
        this.visualElement.setProjectionTargetAxis(axis, min, min + axisLength);
    };
    setProps({ drag = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true, ...remainingProps }: DragControlsProps & MotionProps) {
        this.props = {
            ...remainingProps,
            drag,
            dragDirectionLock,
            dragPropagation,
            dragConstraints,
            dragElastic,
            dragMomentum,
        };
    };
    /**
     * Drag works differently depending on which props are provided.
     *
     * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
     * - If the component will perform layout animations, we output the gesture to the component's
     *      visual bounding box
     * - Otherwise, we apply the delta to the x/y motion values.
     */
    private getAxisMotionValue(axis: string) {
        var _a = this.props, layout = _a.layout, layoutId = _a.layoutId;
        var dragKey = "_drag" + axis.toUpperCase();
        if (this.props[dragKey]) {
            return this.props[dragKey];
        }
        else if (!layout && layoutId === undefined) {
            return this.visualElement.getValue(axis, 0);
        }
    }
    private isLayoutDrag() {
        return !this.getAxisMotionValue("x");
    }
    private isExternalDrag() {
        var _a = this.props, _dragX = _a._dragX, _dragY = _a._dragY;
        return _dragX || _dragY;
    }
    private animateDragEnd(velocity) {
        var _this = this;
        var _a = this.props, drag = _a.drag, dragMomentum = _a.dragMomentum, dragElastic = _a.dragElastic, dragTransition = _a.dragTransition;
        /**
         * Everything beyond the drag gesture should be performed with
         * relative projection so children stay in sync with their parent element.
         */
        var isRelative = convertToRelativeProjection(this.visualElement, this.isLayoutDrag() && !this.isExternalDrag());
        /**
         * If we had previously resolved constraints relative to the viewport,
         * we need to also convert those to a relative coordinate space for the animation
         */
        var constraints = this.constraints || {};
        if (isRelative &&
            Object.keys(constraints).length &&
            this.isLayoutDrag()) {
            var projectionParent = this.visualElement.getProjectionParent();
            if (projectionParent) {
                var relativeConstraints_1 = calcRelativeOffset(projectionParent.projection.targetFinal, constraints);
                eachAxis(function (axis) {
                    var _a = relativeConstraints_1[axis], min = _a.min, max = _a.max;
                    constraints[axis] = {
                        min: isNaN(min) ? undefined : min,
                        max: isNaN(max) ? undefined : max,
                    };
                });
            }
        }
        var momentumAnimations = eachAxis(function (axis) {
            var _a;
            if (!shouldDrag(axis, drag, _this.currentDirection)) {
                return;
            }
            var transition = (_a = constraints === null || constraints === void 0 ? void 0 : constraints[axis]) !== null && _a !== void 0 ? _a : {};
            /**
             * Overdamp the boundary spring if `dragElastic` is disabled. There's still a frame
             * of spring animations so we should look into adding a disable spring option to `inertia`.
             * We could do something here where we affect the `bounceStiffness` and `bounceDamping`
             * using the value of `dragElastic`.
             */
            var bounceStiffness = dragElastic ? 200 : 1000000;
            var bounceDamping = dragElastic ? 40 : 10000000;
            var inertia = __assign(__assign({ type: "inertia", velocity: dragMomentum ? velocity[axis] : 0, bounceStiffness: bounceStiffness,
                bounceDamping: bounceDamping, timeConstant: 750, restDelta: 1, restSpeed: 10 }, dragTransition), transition);
            // If we're not animating on an externally-provided `MotionValue` we can use the
            // component's animation controls which will handle interactions with whileHover (etc),
            // otherwise we just have to animate the `MotionValue` itself.
            return _this.getAxisMotionValue(axis)
                ? _this.startAxisValueAnimation(axis, inertia)
                : _this.visualElement.startLayoutAnimation(axis, inertia, isRelative);
        });
        // Run all animations and then resolve the new drag constraints.
        return Promise.all(momentumAnimations).then(function () {
            var _a, _b;
            (_b = (_a = _this.props).onDragTransitionEnd) === null || _b === void 0 ? void 0 : _b.call(_a);
        });
    }
    stopMotion() {
        var _this = this;
        eachAxis(function (axis) {
            var axisValue = _this.getAxisMotionValue(axis);
            axisValue
                ? axisValue.stop()
                : _this.visualElement.stopLayoutAnimation();
        });
    }
    private startAxisValueAnimation(axis, transition) {
        var axisValue = this.getAxisMotionValue(axis);
        if (!axisValue)
            return;
        var currentValue = axisValue.get();
        axisValue.set(currentValue);
        axisValue.set(currentValue); // Set twice to hard-reset velocity
        return startAnimation(axis, axisValue, 0, transition);
    }
    scalePoint() {
        var _this = this;
        var _a = this.props, drag = _a.drag, dragConstraints = _a.dragConstraints;
        if (!isRefObject(dragConstraints) || !this.constraintsBox)
            return;
        // Stop any current animations as there can be some visual glitching if we resize mid animation
        this.stopMotion();
        // Record the relative progress of the targetBox relative to the constraintsBox
        var boxProgress = { x: 0, y: 0 };
        eachAxis(function (axis) {
            boxProgress[axis] = calcOrigin(_this.visualElement.projection.target[axis], _this.constraintsBox[axis]);
        });
        /**
         * For each axis, calculate the current progress of the layout axis within the constraints.
         * Then, using the latest layout and constraints measurements, reposition the new layout axis
         * proportionally within the constraints.
         */
        this.updateConstraints(function () {
            eachAxis(function (axis) {
                if (!shouldDrag(axis, drag, null))
                    return;
                // Calculate the position of the targetBox relative to the constraintsBox using the
                // previously calculated progress
                var _a = calcPositionFromProgress(_this.visualElement.projection.target[axis], _this.constraintsBox[axis], boxProgress[axis]), min = _a.min, max = _a.max;
                _this.visualElement.setProjectionTargetAxis(axis, min, max);
            });
        });
        /**
         * If any other draggable components are queuing the same tasks synchronously
         * this will wait until they've all been scheduled before flushing.
         */
        setTimeout(flushLayout, 1);
    }
    updateConstraints(onReady?: () => void) {
        var _this = this;
        this.cancelLayout = batchLayout(function (read, write) {
            var ancestors = collectProjectingAncestors(_this.visualElement);
            write(function () {
                return ancestors.forEach(function (element) { return element.resetTransform(); });
            });
            read(function () { return updateLayoutMeasurement(_this.visualElement); });
            write(function () {
                return ancestors.forEach(function (element) { return element.restoreTransform(); });
            });
            read(function () {
                _this.resolveDragConstraints();
            });
            if (onReady)
                write(onReady);
        });
    };
    mount(visualElement: VisualElement): () => void {
        var _this = this;
        var element = visualElement.getInstance();
        /**
         * Attach a pointerdown event listener on this DOM element to initiate drag tracking.
         */
        var stopPointerListener = addPointerEvent(element, "pointerdown", function (event) {
            var _a = _this.props, drag = _a.drag, _b = _a.dragListener, dragListener = _b === void 0 ? true : _b;
            drag && dragListener && _this.start(event);
        });
        /**
         * Attach a window resize listener to scale the draggable target within its defined
         * constraints as the window resizes.
         */
        var stopResizeListener = addDomEvent(window, "resize", function () {
            _this.scalePoint();
        });
        /**
         * Ensure drag constraints are resolved correctly relative to the dragging element
         * whenever its layout changes.
         */
        var stopLayoutUpdateListener = visualElement.onLayoutUpdate(function () {
            if (_this.isDragging) {
                _this.resolveDragConstraints();
            }
        });
        /**
         * If the previous component with this same layoutId was dragging at the time
         * it was unmounted, we want to continue the same gesture on this component.
         */
        var prevDragCursor = visualElement.prevDragCursor;
        if (prevDragCursor) {
            this.start(lastPointerEvent, { cursorProgress: prevDragCursor });
        }
        /**
         * Return a function that will teardown the drag gesture
         */
        return function () {
            stopPointerListener === null || stopPointerListener === void 0 ? void 0 : stopPointerListener();
            stopResizeListener === null || stopResizeListener === void 0 ? void 0 : stopResizeListener();
            stopLayoutUpdateListener === null || stopLayoutUpdateListener === void 0 ? void 0 : stopLayoutUpdateListener();
            _this.cancelDrag();
        };
    };
}

function shouldDrag(direction: DragDirection, drag: boolean | DragDirection | undefined, currentDirection: null | DragDirection) {
    return ((drag === true || drag === direction) &&
        (currentDirection === null || currentDirection === direction));
}
/**
 * Based on an x/y offset determine the current drag direction. If both axis' offsets are lower
 * than the provided threshold, return `null`.
 *
 * @param offset - The x/y offset from origin.
 * @param lockThreshold - (Optional) - the minimum absolute offset before we can determine a drag direction.
 */
function getCurrentDirection(offset: Point2D, lockThreshold = 10) {
    var direction: DragDirection | null = null;
    if (Math.abs(offset.y) > lockThreshold) {
        direction = "y";
    }
    else if (Math.abs(offset.x) > lockThreshold) {
        direction = "x";
    }
    return direction;
}

export { VisualElementDragControls, elementDragControls };

