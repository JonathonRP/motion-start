/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
export type Lock = (() => void) | false;


/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

function createLock(name: string) {
    var lock: string | null = null;
    return function (): Lock {
        var openLock = function () {
            lock = null;
        };
        
        if (lock === null) {
            lock = name;
            return openLock;
        }
        return false;
    };
}
var globalHorizontalLock = createLock("dragHorizontal");
var globalVerticalLock = createLock("dragVertical");
function getGlobalLock(drag: boolean | "x" | "y" | "lockDirection") {
    var lock: Lock = false;
    if (drag === "y") {
        
        lock = globalVerticalLock();
    }
    else if (drag === "x") {
        
        lock = globalHorizontalLock();
    }
    else {
        var openHorizontal_1 = globalHorizontalLock();
        var openVertical_1 = globalVerticalLock();
        if (openHorizontal_1 && openVertical_1) {
            lock = function () {
                openHorizontal_1();
                openVertical_1();
            };
        }
        else {
            // Release the locks because we don't use them
            if (openHorizontal_1)
                openHorizontal_1();
            if (openVertical_1)
                openVertical_1();
        }
    }
    return lock;
}
function isDragActive() {
    // Check the gesture lock - if we get it, it means no drag gesture is active
    // and we can safely fire the tap gesture.
    var openGestureLock = getGlobalLock(true);
    if (!openGestureLock)
        return true;
    openGestureLock();
    return false;
}

export { createLock, getGlobalLock, isDragActive };

