/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Axis, AxisBox2D } from "../../../types/geometry";
interface WithLayoutId {
  getLayoutId: () => undefined | string;
}

/** 
based on framer-motion@4.1.11,
Copyright (c) 2018 Framer B.V.
*/
import { fixed } from "../../../utils/fix-process-env";
import { mix } from "popmotion";

function tweenAxis(target: Axis, prev: Axis, next: Axis, p: number) {
  target.min = mix(prev.min, next.min, p);
  target.max = mix(prev.max, next.max, p);
}
function calcRelativeOffsetAxis(parent: Axis, child: Axis) {
  return {
    min: child.min - parent.min,
    max: child.max - parent.min,
  };
}
function calcRelativeOffset(parent: AxisBox2D, child: AxisBox2D) {
  return {
    x: calcRelativeOffsetAxis(parent.x, child.x),
    y: calcRelativeOffsetAxis(parent.y, child.y),
  };
}
function checkIfParentHasChanged(prev: WithLayoutId, next: WithLayoutId) {
  var prevId = prev.getLayoutId();
  var nextId = next.getLayoutId();
  return prevId !== nextId || (nextId === undefined && prev !== next);
}

const animateLayout = {
  track: <A extends unknown[], R>(fn: (...args: A) => R) => {
    return fn;
  },
};

export {
  calcRelativeOffset,
  calcRelativeOffsetAxis,
  checkIfParentHasChanged,
  tweenAxis,
  animateLayout,
};
