/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { Axis, AxisBox2D } from "../../../types/geometry";
export declare function tweenAxis(target: Axis, prev: Axis, next: Axis, p: number): void;
export declare function calcRelativeOffsetAxis(parent: Axis, child: Axis): {
    min: number;
    max: number;
};
export declare function calcRelativeOffset(parent: AxisBox2D, child: AxisBox2D): AxisBox2D;
interface WithLayoutId {
    getLayoutId: () => undefined | string;
}
export declare function checkIfParentHasChanged(prev: WithLayoutId, next: WithLayoutId): boolean;

/** 
based on framer-motion@4.1.11,
Copyright (c) 2018 Framer B.V.
*/
import {fixed} from '../../../utils/fix-process-env';
import { mix } from 'popmotion';

function tweenAxis(target, prev, next, p) {
    target.min = mix(prev.min, next.min, p);
    target.max = mix(prev.max, next.max, p);
}
function calcRelativeOffsetAxis(parent, child) {
    return {
        min: child.min - parent.min,
        max: child.max - parent.min,
    };
}
function calcRelativeOffset(parent, child) {
    return {
        x: calcRelativeOffsetAxis(parent.x, child.x),
        y: calcRelativeOffsetAxis(parent.y, child.y),
    };
}
function checkIfParentHasChanged(prev, next) {
    var prevId = prev.getLayoutId();
    var nextId = next.getLayoutId();
    return prevId !== nextId || (nextId === undefined && prev !== next);
}

export { calcRelativeOffset, calcRelativeOffsetAxis, checkIfParentHasChanged, tweenAxis };

