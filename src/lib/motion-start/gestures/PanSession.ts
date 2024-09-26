/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Point2D, TransformPoint2D } from "../types/geometry";

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import sync, { cancelSync, getFrameData } from 'framesync';
import { distance, pipe } from 'popmotion';
import { __assign } from 'tslib';
import { extractEventInfo } from '../events/event-info.js';
import type { EventInfo } from "../events/types";
import { addPointerEvent } from '../events/use-pointer-event.js';
import { secondsToMilliseconds } from '../utils/time-conversion.js';
import { isMouseEvent, isTouchEvent } from './utils/event-type.js';

export type AnyPointerEvent = MouseEvent | TouchEvent | PointerEvent;

/**
 * Passed in to pan event handlers like `onPan` the `PanInfo` object contains
 * information about the current state of the tap gesture such as its
 * `point`, `delta`, `offset` and `velocity`.
 *
 * @motion
 *
 * ```jsx
 * <MotionDiv onPan={(event, info) => {
 *   console.log(info.point.x, info.point.y)
 * }} />
 * ```
 *
 * @public
 */
export interface PanInfo {
    /**
     * Contains `x` and `y` values for the current pan position relative
     * to the device or page.
     *
     * @motion
     *
     * ```jsx
     * function onPan(event, info) {
     *   console.log(info.point.x, info.point.y)
     * }
     *
     * <MotionDiv onPan={onPan} />
     * ```
     *
     * @public
     */
    point: Point2D;
    /**
     * Contains `x` and `y` values for the distance moved since
     * the last event.
     *
     * @motion
     *
     * ```jsx
     * function onPan(event, info) {
     *   console.log(info.delta.x, info.delta.y)
     * }
     *
     * <MotionDiv onPan={onPan} />
     * ```
     *
     * @public
     */
    delta: Point2D;
    /**
     * Contains `x` and `y` values for the distance moved from
     * the first pan event.
     *
     * @motion
     *
     * ```jsx
     * function onPan(event, info) {
     *   console.log(info.offset.x, info.offset.y)
     * }
     *
     * <MotionDiv onPan={onPan} />
     * ```
     *
     * @public
     */
    offset: Point2D;
    /**
     * Contains `x` and `y` values for the current velocity of the pointer, in px/ms.
     *
     * @motion
     *
     * ```jsx
     * function onPan(event, info) {
     *   console.log(info.velocity.x, info.velocity.y)
     * }
     *
     * <MotionDiv onPan={onPan} />
     * ```
     *
     * @public
     */
    velocity: Point2D;
}
export type PanHandler = (event: Event, info: PanInfo) => void;
interface PanSessionHandlers {
    onSessionStart: PanHandler;
    onStart: PanHandler;
    onMove: PanHandler;
    onEnd: PanHandler;
    onSessionEnd: PanHandler;
    // TODO: future feature
    // resumeAnimation: () => void
}
interface PanSessionOptions {
    transformPagePoint?: TransformPoint2D;
    // TODO: future feature
    // contextWindow?: (Window & typeof globalThis) | null
    // dragSnapToOrigin?: boolean
}

interface TimestampedPoint extends Point2D {
    timestamp: number
}

/**
 * @internal
 */
export class PanSession {
    /**
     * @internal
     */
    private history!: TimestampedPoint[];
    /**
     * @internal
     */
    private startEvent: PointerEvent | null = null;
    /**
     * @internal
     */
    private lastMoveEvent: PointerEvent | null = null;
    /**
     * @internal
     */
    private lastMoveEventInfo: EventInfo | null = null;
    /**
     * @internal
     */
    private transformPagePoint?: TransformPoint2D
    /**
     * @internal
     */
    private handlers: Partial<PanSessionHandlers> = {};
    /**
     * @internal
     */
    private removeListeners!: Function;

    // TODO: future implementation of newer features
    // /**
    //  * For determining if an animation should resume after it is interupted
    //  * 
    //  * @internal
    //  */
    // private dragSnapToOrigin: boolean

    // /**
    //  * @internal
    //  */
    // private contextWindow: PanSessionOptions["contextWindow"] = window


    constructor(event: PointerEvent, handlers: Partial<PanSessionHandlers>, { transformPagePoint }: PanSessionOptions = {}) {
        // If we have more than one touch, don't start detecting this gesture
        if (isTouchEvent(event) && event.touches.length > 1)
            return;
        this.handlers = handlers;
        this.transformPagePoint = transformPagePoint;
        var info = extractEventInfo(event);
        var initialInfo = transformPoint(info, this.transformPagePoint);
        var point = initialInfo.point;
        var timestamp = getFrameData().timestamp;
        this.history = [{ ...point, timestamp }];
        var onSessionStart = handlers.onSessionStart;
        onSessionStart &&
            onSessionStart(event, getPanInfo(initialInfo, this.history));
        this.removeListeners = pipe(addPointerEvent(window, "pointermove", this.handlePointerMove), addPointerEvent(window, "pointerup", this.handlePointerUp), addPointerEvent(window, "pointercancel", this.handlePointerUp));
    }

    private updatePoint = () => {
        if (!(this.lastMoveEvent && this.lastMoveEventInfo))
            return;
        var info = getPanInfo(this.lastMoveEventInfo, this.history);
        var isPanStarted = this.startEvent !== null;
        // Only start panning if the offset is larger than 3 pixels. If we make it
        // any larger than this we'll want to reset the pointer history
        // on the first update to avoid visual snapping to the cursoe.
        var isDistancePastThreshold = distance(info.offset, { x: 0, y: 0 }) >= 3;
        if (!isPanStarted && !isDistancePastThreshold)
            return;
        var point = info.point;
        var timestamp = getFrameData().timestamp;
        this.history.push(__assign(__assign({}, point), { timestamp: timestamp }));
        var _a = this.handlers, onStart = _a.onStart, onMove = _a.onMove;
        if (!isPanStarted) {
            onStart && onStart(this.lastMoveEvent, info);
            this.startEvent = this.lastMoveEvent;
        }
        onMove && onMove(this.lastMoveEvent, info);
    };
    private handlePointerMove = (event: PointerEvent, info: EventInfo) => {
        this.lastMoveEvent = event;
        this.lastMoveEventInfo = transformPoint(info, this.transformPagePoint);
        // Because Safari doesn't trigger mouseup events when it's above a `<select>`
        if (isMouseEvent(event) && event.buttons === 0) {
            this.handlePointerUp(event, info);
            return;
        }
        // Throttle mouse move event to once per frame
        sync.update(this.updatePoint, true);
    };
    private handlePointerUp = (event: PointerEvent, info: EventInfo) => {
        this.end();
        var _a = this.handlers, onEnd = _a.onEnd, onSessionEnd = _a.onSessionEnd;
        var panInfo = getPanInfo(transformPoint(info, this.transformPagePoint), this.history);
        if (this.startEvent && onEnd) {
            onEnd(event, panInfo);
        }
        onSessionEnd && onSessionEnd(event, panInfo);
    };
    updateHandlers(handlers: Partial<PanSessionHandlers>) {
        this.handlers = handlers;
    };
    end() {
        this.removeListeners && this.removeListeners();
        cancelSync.update(this.updatePoint);
    };
}


function transformPoint(info: EventInfo, transformPagePoint?: (point: Point2D) => Point2D) {
    return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a: Point2D, b: Point2D): Point2D {
    return { x: a.x - b.x, y: a.y - b.y };
}
function getPanInfo(_a: EventInfo, history: TimestampedPoint[]) {
    var point = _a.point;
    return {
        point: point,
        delta: subtractPoint(point, lastDevicePoint(history)),
        offset: subtractPoint(point, startDevicePoint(history)),
        velocity: getVelocity(history, 0.1),
    };
}
function startDevicePoint(history: TimestampedPoint[]) {
    return history[0];
}
function lastDevicePoint(history: TimestampedPoint[]) {
    return history[history.length - 1];
}
function getVelocity(history: TimestampedPoint[], timeDelta: number) {
    if (history.length < 2) {
        return { x: 0, y: 0 };
    }
    var i = history.length - 1;
    var timestampedPoint = null;
    var lastPoint = lastDevicePoint(history);
    while (i >= 0) {
        timestampedPoint = history[i];
        if (lastPoint.timestamp - timestampedPoint.timestamp >
            secondsToMilliseconds(timeDelta)) {
            break;
        }
        i--;
    }
    if (!timestampedPoint) {
        return { x: 0, y: 0 };
    }
    var time = (lastPoint.timestamp - timestampedPoint.timestamp) / 1000;
    if (time === 0) {
        return { x: 0, y: 0 };
    }
    var currentVelocity = {
        x: (lastPoint.x - timestampedPoint.x) / time,
        y: (lastPoint.y - timestampedPoint.y) / time,
    };
    if (currentVelocity.x === Infinity) {
        currentVelocity.x = 0;
    }
    if (currentVelocity.y === Infinity) {
        currentVelocity.y = 0;
    }
    return currentVelocity;
}

// export { PanSession };
