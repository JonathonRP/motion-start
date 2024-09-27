/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { MotionValue } from "../index.js";
/**
 * @public
 */
export interface ScrollMotionValues {
    scrollX: MotionValue<number>;
    scrollY: MotionValue<number>;
    scrollXProgress: MotionValue<number>;
    scrollYProgress: MotionValue<number>;
}
export interface ScrollOffsets {
    xOffset: number;
    yOffset: number;
    xMaxOffset: number;
    yMaxOffset: number;
}
export type GetScrollOffsets = () => ScrollOffsets;

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { motionValue } from '../index.js';

function createScrollMotionValues(startStopNotifier?: any): ScrollMotionValues {
    const hasListener = { x: false, y: false, xp: false, yp: false }
    let stop: Promise<any>
    const jointNotifier = startStopNotifier ? (type: string | number) => ()=>{
        if (!hasListener.x && !hasListener.y && !hasListener.xp && !hasListener.yp) {
            stop = startStopNotifier();
        }//@ts-ignore
        hasListener[type] = true;
        return () => {//@ts-ignore
            hasListener[type] = false;
            if (!hasListener.x && !hasListener.y && !hasListener.xp && !hasListener.yp) {
                if (stop){
                    stop.then(v=>v())
                }
            }
        }


    } : ()=>() => { }

    const smvs = {
        scrollX: motionValue(0,jointNotifier("x")),//wierd
        scrollY: motionValue(0,jointNotifier("y")),
        scrollXProgress: motionValue(0,jointNotifier("xp")),
        scrollYProgress: motionValue(0,jointNotifier("yp")),
    };

    return smvs;
}
function setProgress(offset: number, maxOffset: number, value: MotionValue<number>) {
    value.set(!offset || !maxOffset ? 0 : offset / maxOffset);
}
function createScrollUpdater(values: ScrollMotionValues, getOffsets: GetScrollOffsets) {
    var update = function () {
        var _a = getOffsets(), xOffset = _a.xOffset, yOffset = _a.yOffset, xMaxOffset = _a.xMaxOffset, yMaxOffset = _a.yMaxOffset;
        // Set absolute positions
        values.scrollX.set(xOffset);
        values.scrollY.set(yOffset);
        // Set 0-1 progress
        setProgress(xOffset, xMaxOffset, values.scrollXProgress);
        setProgress(yOffset, yMaxOffset, values.scrollYProgress);
    };
    update();
    return update;
}

export { createScrollMotionValues, createScrollUpdater };

