/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { EventInfo } from "./types";
export declare type EventListenerWithPointInfo = (e: MouseEvent | TouchEvent | PointerEvent, info: EventInfo) => void;
export declare function extractEventInfo(event: MouseEvent | TouchEvent | PointerEvent, pointType?: "page" | "client"): EventInfo;
export declare function getViewportPointFromEvent(event: MouseEvent | TouchEvent | PointerEvent): EventInfo;
export declare const wrapHandler: (handler: EventListenerWithPointInfo, shouldFilterPrimaryPointer?: boolean) => EventListener;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

import { isTouchEvent } from '../gestures/utils/event-type.js';

/**
 * Filters out events not attached to the primary pointer (currently left mouse button)
 * @param eventHandler
 */
function filterPrimaryPointer(eventHandler) {
    return function (event) {
        var isMouseEvent = event instanceof MouseEvent;
        var isPrimaryPointer = !isMouseEvent ||
            (isMouseEvent && event.button === 0);
        if (isPrimaryPointer) {
            eventHandler(event);
        }
    };
}
var defaultPagePoint = { pageX: 0, pageY: 0 };
function pointFromTouch(e, pointType) {
    if (pointType === void 0) { pointType = "page"; }
    var primaryTouch = e.touches[0] || e.changedTouches[0];
    var point = primaryTouch || defaultPagePoint;
    return {
        x: point[pointType + "X"],
        y: point[pointType + "Y"],
    };
}
function pointFromMouse(point, pointType) {
    if (pointType === void 0) { pointType = "page"; }
    return {
        x: point[pointType + "X"],
        y: point[pointType + "Y"],
    };
}
function extractEventInfo(event, pointType) {
    if (pointType === void 0) { pointType = "page"; }
    return {
        point: isTouchEvent(event)
            ? pointFromTouch(event, pointType)
            : pointFromMouse(event, pointType),
    };
}
function getViewportPointFromEvent(event) {
    return extractEventInfo(event, "client");
}
var wrapHandler = function (handler, shouldFilterPrimaryPointer) {
    if (shouldFilterPrimaryPointer === void 0) { shouldFilterPrimaryPointer = false; }
    var listener = function (event) {
        return handler(event, extractEventInfo(event));
    };
    return shouldFilterPrimaryPointer
        ? filterPrimaryPointer(listener)
        : listener;
};

export { extractEventInfo, getViewportPointFromEvent, wrapHandler };
