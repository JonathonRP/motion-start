/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { EventInfo } from "./types";
export type EventListenerWithPointInfo = (e: PointerEvent, info: EventInfo) => void;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

import { isTouchEvent } from '../gestures/utils/event-type.js';

/**
 * Filters out events not attached to the primary pointer (currently left mouse button)
 * @param eventHandler
 */
function filterPrimaryPointer(eventHandler: { (event: any): void; (arg0: any): void; }) {
    return function (event: { button: number; }) {
        var isMouseEvent = event instanceof MouseEvent;
        var isPrimaryPointer = !isMouseEvent ||
            (isMouseEvent && event.button === 0);
        if (isPrimaryPointer) {
            eventHandler(event);
        }
    };
}
var defaultPagePoint = { pageX: 0, pageY: 0 };
function pointFromTouch(e: TouchEvent, pointType?: "page" | "client") {
    if (pointType === void 0) { pointType = "page"; }
    var primaryTouch = e.touches[0] || e.changedTouches[0];
    var point = primaryTouch as any || defaultPagePoint as any;
    return {
        x: point[pointType + "X"],
        y: point[pointType + "Y"],
    };
}
function pointFromMouse(point: any, pointType?: "page" | "client") {
    if (pointType === void 0) { pointType = "page"; }
    return {
        x: point[pointType + "X"],
        y: point[pointType + "Y"],
    };
}
function extractEventInfo(event: MouseEvent | TouchEvent | PointerEvent, pointType?: "page" | "client"): EventInfo {
    if (pointType === void 0) { pointType = "page"; }
    return {
        point: isTouchEvent(event)
            ? pointFromTouch(event, pointType)
            : pointFromMouse(event, pointType),
    };
}
function getViewportPointFromEvent(event: MouseEvent | TouchEvent | PointerEvent) {
    return extractEventInfo(event, "client");
}
var wrapHandler = function (handler: EventListenerWithPointInfo, shouldFilterPrimaryPointer?: boolean): EventListener {
    if (shouldFilterPrimaryPointer === void 0) { shouldFilterPrimaryPointer = false; }
    var listener = function (event: PointerEvent) {
        return handler(event, extractEventInfo(event));
    };
    return shouldFilterPrimaryPointer
        // @ts-expect-error
        ? filterPrimaryPointer(listener)
        // @ts-expect-error
        : listener;
};

export { extractEventInfo, getViewportPointFromEvent, wrapHandler };

