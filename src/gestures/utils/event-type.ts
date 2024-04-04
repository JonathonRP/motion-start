/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
export declare function isMouseEvent(event: MouseEvent | TouchEvent | PointerEvent): event is MouseEvent;
export declare function isTouchEvent(event: MouseEvent | TouchEvent | PointerEvent): event is TouchEvent;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

function isMouseEvent(event) {
    // PointerEvent inherits from MouseEvent so we can't use a straight instanceof check.
    if (typeof PointerEvent !== "undefined" && event instanceof PointerEvent) {
        return !!(event.pointerType === "mouse");
    }
    return event instanceof MouseEvent;
}
function isTouchEvent(event) {
    var hasTouches = !!event.touches;
    return hasTouches;
}

export { isMouseEvent, isTouchEvent };
