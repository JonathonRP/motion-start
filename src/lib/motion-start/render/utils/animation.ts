/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VariantLabels } from "../../motion/types";
import type { Target, TargetAndTransition, TargetResolver, TargetWithKeyframes, Transition } from "../../types";
import type { VisualElement } from "../types";
import { AnimationType } from "./types";
export type AnimationDefinition = VariantLabels | TargetAndTransition | TargetResolver;
export type AnimationOptions = {
    delay?: number;
    transitionOverride?: Transition;
    custom?: any;
    type?: AnimationType;
};
export type MakeTargetAnimatable = (visualElement: VisualElement, target: TargetWithKeyframes, origin?: Target, transitionEnd?: Target) => {
    target: TargetWithKeyframes;
    transitionEnd?: Target;
};


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { __assign, __read, __rest } from 'tslib';
import { startAnimation } from '../../animation/utils/transitions.js';
import { setTarget } from './setters.js';
import { resolveVariant } from './variants.js';

/**
 * @internal
 */
function animateVisualElement(visualElement: VisualElement, definition: AnimationDefinition, options: AnimationOptions = {}) {
    visualElement.notifyAnimationStart();
    var animation;
    if (Array.isArray(definition)) {
        var animations = definition.map(function (variant) {
            return animateVariant(visualElement, variant, options);
        });
        animation = Promise.all(animations);
    }
    else if (typeof definition === "string") {
        animation = animateVariant(visualElement, definition, options);
    }
    else {
        var resolvedDefinition = typeof definition === "function"
            ? resolveVariant(visualElement, definition, options.custom)
            : definition;
        animation = animateTarget(visualElement, resolvedDefinition, options);
    }
    return animation.then(function () {
        return visualElement.notifyAnimationComplete(definition);
    }) as Promise<void>;
}
function animateVariant(visualElement: VisualElement, variant: string | TargetAndTransition | TargetResolver, options: AnimationOptions = {}) {
    var _a;
    if (options === void 0) { options = {}; }
    var resolved = resolveVariant(visualElement, variant, options.custom);
    var _b = (resolved || {}).transition, transition = _b === void 0 ? visualElement.getDefaultTransition() || {} : _b;
    if (options.transitionOverride) {
        transition = options.transitionOverride;
    }
    /**
     * If we have a variant, create a callback that runs it as an animation.
     * Otherwise, we resolve a Promise immediately for a composable no-op.
     */
    var getAnimation = resolved
        ? function () { return animateTarget(visualElement, resolved as AnimationDefinition, options); }
        : function () { return Promise.resolve(); };
    /**
     * If we have children, create a callback that runs all their animations.
     * Otherwise, we resolve a Promise immediately for a composable no-op.
     */
    var getChildAnimations = ((_a = visualElement.variantChildren) === null || _a === void 0 ? void 0 : _a.size)
        ? function (forwardDelay: number | undefined) {
            if (forwardDelay === void 0) { forwardDelay = 0; }
            var _a = transition.delayChildren, delayChildren = _a === void 0 ? 0 : _a, staggerChildren = transition.staggerChildren, staggerDirection = transition.staggerDirection;
            return animateChildren(visualElement, variant, delayChildren + forwardDelay, staggerChildren, staggerDirection, options);
        }
        : function () { return Promise.resolve(); };
    /**
     * If the transition explicitly defines a "when" option, we need to resolve either
     * this animation or all children animations before playing the other.
     */
    var when = transition.when;
    if (when) {
        var _c = __read(when === "beforeChildren"
            ? [getAnimation, getChildAnimations]
            : [getChildAnimations, getAnimation], 2), first = _c[0], last = _c[1];
        return first().then(last);
    }
    else {
        return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
    }
}
/**
 * @internal
 */
function animateTarget(visualElement: VisualElement, definition: AnimationDefinition, _a:any) {
    var _b;
    var _c = _a === void 0 ? {} : _a, _d = _c.delay, delay = _d === void 0 ? 0 : _d, transitionOverride = _c.transitionOverride, type = _c.type;
    var _e = visualElement.makeTargetAnimatable(definition as TargetAndTransition), _f = _e.transition, transition = _f === void 0 ? visualElement.getDefaultTransition() : _f, transitionEnd = _e.transitionEnd, target = __rest(_e, ["transition", "transitionEnd"]);
    if (transitionOverride)
        transition = transitionOverride;
    var animations = [];
    var animationTypeState = type && ((_b = visualElement.animationState) === null || _b === void 0 ? void 0 : _b.getState()[type]);
    for (var key in target) {
        var value = visualElement.getValue(key);
        var valueTarget = target[key];
        if (!value ||
            valueTarget === undefined ||
            (animationTypeState &&
                shouldBlockAnimation(animationTypeState, key))) {
            continue;
        }
        var animation = startAnimation(key, value, valueTarget, __assign({ delay: delay }, transition));
        animations.push(animation);
    }
    return Promise.all(animations).then(function () {
        transitionEnd && setTarget(visualElement, transitionEnd);
    });
}
function animateChildren(visualElement: VisualElement<any, any>, variant: string | TargetAndTransition | TargetResolver, delayChildren: number | undefined, staggerChildren: number | undefined, staggerDirection: number | undefined, options: AnimationOptions) {
    if (delayChildren === void 0) { delayChildren = 0; }
    if (staggerChildren === void 0) { staggerChildren = 0; }
    if (staggerDirection === void 0) { staggerDirection = 1; }
    var animations: any[] = [];
    var maxStaggerDuration = (visualElement!.variantChildren!.size! - 1) * staggerChildren;
    var generateStaggerDuration = staggerDirection === 1
        ? function (i: number | undefined) {
            if (i === void 0) { i = 0; }
            return i * staggerChildren;
        }
        : function (i: number | undefined) {
            if (i === void 0) { i = 0; }
            return maxStaggerDuration - i * staggerChildren;
        };
    Array.from(visualElement!.variantChildren!)
        .sort(sortByTreeOrder)
        .forEach(function (child, i) {
            animations.push(animateVariant(child, variant, __assign(__assign({}, options), { delay: delayChildren + generateStaggerDuration(i) })).then(function () { return child.notifyAnimationComplete(variant); }));
        });
    return Promise.all(animations);
}
function stopAnimation(visualElement: VisualElement) {
    visualElement.forEachValue(function (value) { return value.stop(); });
}
function sortByTreeOrder(a: VisualElement, b: VisualElement) {
    return a.sortNodePosition(b);
}
/**
 * Decide whether we should block this animation. Previously, we achieved this
 * just by checking whether the key was listed in protectedKeys, but this
 * posed problems if an animation was triggered by afterChildren and protectedKeys
 * had been set to true in the meantime.
 */
function shouldBlockAnimation(_a: { protectedKeys: any; needsAnimating: any; }, key: string) {

    var protectedKeys = _a.protectedKeys, needsAnimating = _a.needsAnimating;
    var shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
    needsAnimating[key] = false;
    return shouldBlock;
}

export { animateVisualElement, sortByTreeOrder, stopAnimation };

