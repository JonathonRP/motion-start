/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { PopmotionTransitionProps, ValueTarget, SingleTarget, KeyframesTarget } from "../../types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

import { __assign } from 'tslib';
import { isKeyframesTarget } from './is-keyframes-target.js';

var underDampedSpring = function () { return ({
    type: "spring",
    stiffness: 500,
    damping: 25,
    restDelta: 0.5,
    restSpeed: 10,
}); };
var criticallyDampedSpring = function (to: SingleTarget) { return ({
    type: "spring",
    stiffness: 550,
    damping: to === 0 ? 2 * Math.sqrt(550) : 30,
    restDelta: 0.01,
    restSpeed: 10,
}); };
var linearTween = function () { return ({
    type: "keyframes",
    ease: "linear",
    duration: 0.3,
}); };
var keyframes = function (values: KeyframesTarget) { return ({
    type: "keyframes",
    duration: 0.8,
    values: values,
}); };
var defaultTransitions = {
    x: underDampedSpring,
    y: underDampedSpring,
    z: underDampedSpring,
    rotate: underDampedSpring,
    rotateX: underDampedSpring,
    rotateY: underDampedSpring,
    rotateZ: underDampedSpring,
    scaleX: criticallyDampedSpring,
    scaleY: criticallyDampedSpring,
    scale: criticallyDampedSpring,
    opacity: linearTween,
    backgroundColor: linearTween,
    color: linearTween,
    default: criticallyDampedSpring,
};

// TODO: need to bring closer to Transition - then can use keyof typeof defaultTransitions.
var getDefaultTransition = function (valueKey: string, to: ValueTarget): PopmotionTransitionProps {
    var transitionFactory: (v: any) => any;
    if (isKeyframesTarget(to)) {
        transitionFactory = keyframes;
    }
    else {
        transitionFactory =
            (defaultTransitions as any)[valueKey] || defaultTransitions.default;
    }
    return __assign({ to: to }, transitionFactory(to));
};

export { criticallyDampedSpring, getDefaultTransition, linearTween, underDampedSpring };
