/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { PlaybackControls } from "popmotion";
import type { ResolvedValues, VisualElement } from "../../../render/types";
import type { Inertia, Just, Keyframes, None, Orchestration, PermissiveTransitionDefinition, Repeat, ResolvedValueTarget, Spring, Transition, Tween } from "../../../types";
export interface Crossfader {
    isActive(): boolean;
    getCrossfadeState(element: VisualElement): ResolvedValues | undefined;
    toLead(transition?: Transition): PlaybackControls;
    fromLead(transition?: Transition): PlaybackControls;
    setOptions(options: CrossfadeAnimationOptions): void;
    reset(): void;
    stop(): void;
    getLatestValues(): ResolvedValues;
}
export interface CrossfadeAnimationOptions {
    lead?: VisualElement;
    follow?: VisualElement;
    prevValues?: ResolvedValues;
    crossfadeOpacity?: boolean;
    preserveFollowOpacity?: boolean;
}


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { fixed } from '../../../utils/fix-process-env.js';
import { __assign } from 'tslib';
import sync, { getFrameData } from 'framesync';
import { mix, progress, linear, mixColor, circOut } from 'popmotion';
import { animate } from '../../../animation/animate.js';
import { getValueTransition } from '../../../animation/utils/transitions.js';
import { motionValue } from '../../../value/index.js';

function createCrossfader(): Crossfader {
    /**
     * The current state of the crossfade as a value between 0 and 1
     */
    var progress = motionValue(1);
    var options = {
        lead: undefined,
        follow: undefined,
        crossfadeOpacity: false,
        preserveFollowOpacity: false,
    };
    var prevOptions = __assign({}, options);
    var leadState = {};
    var followState = {};
    /**
     *
     */
    var isActive = false;
    /**
     *
     */
    var finalCrossfadeFrame: number | null = null;
    /**
     * Framestamp of the last frame we updated values at.
     */
    var prevUpdate = 0;
    function startCrossfadeAnimation(target: ResolvedValueTarget, transition: (Orchestration & Repeat & Tween) | (Orchestration & Repeat & Spring) | (Orchestration & Repeat & Keyframes) | (Orchestration & Repeat & Inertia) | (Orchestration & Repeat & Just) | (Orchestration & Repeat & None) | (Orchestration & Repeat & PermissiveTransitionDefinition) | undefined) {
        var lead = options.lead, follow = options.follow;
        isActive = true;
        finalCrossfadeFrame = null;
        var hasUpdated = false;
        var onUpdate = function () {
            hasUpdated = true;
            lead && lead.scheduleRender(); //wierd
            follow && follow.scheduleRender();
        };
        var onComplete = function () {
            isActive = false;
            /**
             * If the crossfade animation is no longer active, flag a frame
             * that we're still allowed to crossfade
             */
            finalCrossfadeFrame = getFrameData().timestamp;
        };
        transition = transition && getValueTransition(transition, "crossfade");
        return animate(progress, target, __assign(__assign({}, transition), {
            onUpdate: onUpdate, onComplete: function () {
                if (!hasUpdated) {
                    progress.set(target);
                    /**
                     * If we never ran an update, for instance if this was an instant transition, fire a
                     * simulated final frame to ensure the crossfade gets applied correctly.
                     */
                    sync.read(onComplete);
                }
                else {
                    onComplete();
                }
                onUpdate();
            }
        }));
    }
    function updateCrossfade() {
        var _a, _b;
        /**
         * We only want to compute the crossfade once per frame, so we
         * compare the previous update framestamp with the current frame
         * and early return if they're the same.
         */
        var timestamp = getFrameData().timestamp;
        var lead = options.lead, follow = options.follow;
        if (timestamp === prevUpdate || !lead)
            return;
        prevUpdate = timestamp;
        /**
         * Merge each component's latest values into our crossfaded state
         * before crossfading.
         */
        var latestLeadValues = lead.getLatestValues();
        Object.assign(leadState, latestLeadValues);
        var latestFollowValues = follow
            ? follow.getLatestValues()
            : options.prevValues;
        Object.assign(followState, latestFollowValues);
        var p = progress.get();
        /**
         * Crossfade the opacity between the two components. This will result
         * in a different opacity for each component.
         */
        var leadTargetOpacity = (_a = latestLeadValues.opacity) !== null && _a !== void 0 ? _a : 1;
        var followTargetOpacity = (_b = latestFollowValues === null || latestFollowValues === void 0 ? void 0 : latestFollowValues.opacity) !== null && _b !== void 0 ? _b : 1;
        if (options.crossfadeOpacity && follow) {
            leadState.opacity = mix(
                /**
                 * If the follow child has been completely hidden we animate
                 * this opacity from its previous opacity, but otherwise from completely transparent.
                 */
                follow.isVisible !== false ? 0 : followTargetOpacity, leadTargetOpacity, easeCrossfadeIn(p));
            followState.opacity = options.preserveFollowOpacity
                ? followTargetOpacity
                : mix(followTargetOpacity, 0, easeCrossfadeOut(p));
        }
        else if (!follow) {
            leadState.opacity = mix(followTargetOpacity, leadTargetOpacity, p);
        }
        mixValues(leadState, followState, latestLeadValues, latestFollowValues || {}, Boolean(follow), p);
    }
    return {
        isActive: function () {
            return leadState &&
                (isActive || getFrameData().timestamp === finalCrossfadeFrame);
        },
        fromLead: function (transition) {
            return startCrossfadeAnimation(0, transition);
        },
        toLead: function (transition) {
            var initialProgress = 0;
            if (!options.prevValues && !options.follow) {
                /**
                 * If we're not coming from anywhere, start at the end of the animation.
                 */
                initialProgress = 1;
            }
            else if (prevOptions.lead === options.follow &&
                prevOptions.follow === options.lead) {
                /**
                 * If we're swapping follow/lead we can reverse the progress
                 */
                initialProgress = 1 - progress.get();
            }
            progress.set(initialProgress);
            return startCrossfadeAnimation(1, transition);
        },
        reset: function () { return progress.set(1); },
        stop: function () { return progress.stop(); },
        getCrossfadeState: function (element) {
            updateCrossfade();
            if (element === options.lead) {
                return leadState;
            }
            else if (element === options.follow) {
                return followState;
            }
        },
        setOptions: function (newOptions) {
            prevOptions = options;
            options = newOptions;
            leadState = {};
            followState = {};
        },
        getLatestValues: function () {
            return leadState;
        },
    };
}
var easeCrossfadeIn = compress(0, 0.5, circOut);
var easeCrossfadeOut = compress(0.5, 0.95, linear);
function compress(min, max, easing) {
    return function (p) {
        // Could replace ifs with clamp
        if (p < min)
            return 0;
        if (p > max)
            return 1;
        return easing(progress(min, max, p));
    };
}
var borders = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"];
var numBorders = borders.length;
function mixValues(leadState, followState, latestLeadValues, latestFollowValues, hasFollowElement, p) {
    /**
     * Mix border radius
     */
    for (var i = 0; i < numBorders; i++) {
        var borderLabel = "border" + borders[i] + "Radius";
        var followRadius = getRadius(latestFollowValues, borderLabel);
        var leadRadius = getRadius(latestLeadValues, borderLabel);
        if (followRadius === undefined && leadRadius === undefined)
            continue;
        followRadius || (followRadius = 0);
        leadRadius || (leadRadius = 0);
        /**
         * Currently we're only crossfading between numerical border radius.
         * It would be possible to crossfade between percentages for a little
         * extra bundle size.
         */
        if (typeof followRadius === "number" &&
            typeof leadRadius === "number") {
            var radius = Math.max(mix(followRadius, leadRadius, p), 0);
            leadState[borderLabel] = followState[borderLabel] = radius;
        }
    }
    /**
     * Mix rotation
     */
    if (latestFollowValues.rotate || latestLeadValues.rotate) {
        var rotate = mix(latestFollowValues.rotate || 0, latestLeadValues.rotate || 0, p);
        leadState.rotate = followState.rotate = rotate;
    }
    /**
     * We only want to mix the background color if there's a follow element
     * that we're not crossfading opacity between. For instance with switch
     * AnimateSharedLayout animations, this helps the illusion of a continuous
     * element being animated but also cuts down on the number of paints triggered
     * for elements where opacity is doing that work for us.
     */
    if (!hasFollowElement &&
        latestLeadValues.backgroundColor &&
        latestFollowValues.backgroundColor) {
        /**
         * This isn't ideal performance-wise as mixColor is creating a new function every frame.
         * We could probably create a mixer that runs at the start of the animation but
         * the idea behind the crossfader is that it runs dynamically between two potentially
         * changing targets (ie opacity or borderRadius may be animating independently via variants)
         */
        leadState.backgroundColor = followState.backgroundColor = mixColor(latestFollowValues.backgroundColor, latestLeadValues.backgroundColor)(p);
    }
}
function getRadius(values, radiusName) {
    var _a;
    return (_a = values[radiusName]) !== null && _a !== void 0 ? _a : values.borderRadius;
}

export { createCrossfader };
